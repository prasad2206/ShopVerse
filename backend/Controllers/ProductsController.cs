using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopVerse.Data;
using ShopVerse.Models;
using ShopVerse.DTOs;
using ShopVerse.Services;
using Microsoft.AspNetCore.Http;



namespace ShopVerse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;  // DB context instance
        private readonly IImageService _imageService; // image service

        public ProductsController(AppDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        // GET: api/products?search=...&category=...&minPrice=...&maxPrice=...&pageNumber=1&pageSize=10
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] string? category,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int pageNumber = 1,        // Default: 1st page
            [FromQuery] int pageSize = 10)         // Default: 10 items per page

        {
            // Step 0️: Validate pagination inputs
            if (pageNumber <= 0 || pageSize <= 0)
                return BadRequest(new { message = "Page number and size must be positive." });

            // Validate query filters
            if (minPrice < 0 || maxPrice < 0)
                return BadRequest(new { message = "Price values cannot be negative." });

            if (minPrice.HasValue && maxPrice.HasValue && minPrice > maxPrice)
                return BadRequest(new { message = "Min price cannot be greater than max price." });


            // Step 1️: Base Query
            var query = _context.Products.AsNoTracking().AsQueryable();


            // Step 2️: Search Filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p =>
                    (p.Name != null && p.Name.Contains(search)) ||
                    (p.Description != null && p.Description.Contains(search))
                );
            }

            // Step 3️: Category Filter
            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(p => p.Category == category);

            // Step 4️: Price Range
            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);
            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            // Step 5️: Total count before pagination
            var totalItems = await query.CountAsync();

            // Step 6️: Apply Pagination
            var products = await query
                .Skip((pageNumber - 1) * pageSize)   // Skip previous pages
                .Take(pageSize)                      // Take current page items
                .ToListAsync();

            // Step 7️: Prepare Response
            var response = new
            {
                TotalItems = totalItems,                         // total count
                PageNumber = pageNumber,                         // current page
                PageSize = pageSize,                             // page size
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                Products = products                              // paginated data
            };

            // Step 8️: Return paginated result
            return Ok(response);
        }


        // GET: api/products/{id} → Get product by ID
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products.FindAsync(id);   // Find product
            if (product == null)
                return NotFound(new { message = "Product not found" });

            return Ok(product);
        }

        //GET: api/products/categories → List of unique category names
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Products
                .Where(p => !string.IsNullOrEmpty(p.Category))
                .Select(p => p.Category!)
                .Distinct()
                .ToListAsync();

            return Ok(categories);
        }



        // POST: api/products → Add new product (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPost]
        [RequestSizeLimit(10_000_000)] // 🆕 Max 10 MB
        public async Task<IActionResult> Create([FromForm] ProductDto dto) // FromForm (multipart)
        {
            // Map DTO → Entity
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                Category = dto.Category
            };

            // Save image if uploaded
            if (dto.ImageFile != null)
                product.ImageUrl = await _imageService.SaveImageAsync(dto.ImageFile);
            else
                product.ImageUrl = dto.ImageUrl;

            _context.Products.Add(product);          // Add to DB
            await _context.SaveChangesAsync();       // Save changes

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }


        // PUT: api/products/{id} → Update product (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        [RequestSizeLimit(10_000_000)] // Allow up to 10 MB image
        public async Task<IActionResult> Update(int id, [FromForm] ProductDto dto)
        {

            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            Console.WriteLine($"🔍 AUTH HEADER: {authHeader}");

            var userRole = User.FindFirst("role")?.Value;
            Console.WriteLine($"🔍 ROLE FROM TOKEN: {userRole}");

            var userName = User.Identity?.Name;
            Console.WriteLine($"🔍 USER NAME: {userName}");

            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = "Product not found" });

            // Update basic fields
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;
            product.Category = dto.Category;

            // Handle image update
            if (dto.ImageFile != null)
            {
                // delete old image if exists
                if (!string.IsNullOrEmpty(product.ImageUrl))
                    await _imageService.DeleteImageAsync(product.ImageUrl);

                // save new image
                var newPath = await _imageService.SaveImageAsync(dto.ImageFile);
                product.ImageUrl = newPath;
            }
            else if (!string.IsNullOrEmpty(dto.ImageUrl))
            {
                // Keep or manually update existing URL
                product.ImageUrl = dto.ImageUrl;
            }
            // else keep existing if nothing provided

            await _context.SaveChangesAsync();
            return Ok(new { message = "Product updated successfully", product });
        }


        // DELETE: api/products/{id} → Delete product (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = "Product not found" });

            // Delete associated image if exists
            if (!string.IsNullOrEmpty(product.ImageUrl))
                await _imageService.DeleteImageAsync(product.ImageUrl);

            _context.Products.Remove(product);       // Remove from DB
            await _context.SaveChangesAsync();       // Commit delete

            return Ok(new { message = "Product deleted successfully" });
        }


        // POST: api/products/{id}/upload-image → Upload or update product image (Admin only)

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/upload-image")]
        [RequestSizeLimit(10_000_000)] // max 10 MB
        public async Task<IActionResult> UploadProductImage(int id, IFormFile image)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                    return NotFound(new { message = "Product not found" });

                if (image == null || image.Length == 0)
                    return BadRequest(new { message = "No image uploaded" });

                // Delete old image if exists
                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    Console.WriteLine($"🗑 Deleting old image: {product.ImageUrl}");
                    await _imageService.DeleteImageAsync(product.ImageUrl);
                }

                // Save new image
                var relativePath = await _imageService.SaveImageAsync(image);

                // Save uploaded image and store URL for frontend
                product.ImageUrl = relativePath;

                _context.Products.Update(product);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Image uploaded successfully",
                    imageUrl = product.ImageUrl
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UploadProductImage] Error: {ex}");
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }



        // GET: api/products/public → Public product listing (no auth)
        [AllowAnonymous]
        [HttpGet("public")]
        public async Task<IActionResult> GetPublicProducts()
        {
            var products = await _context.Products
                .AsNoTracking()                           // Read-only optimization
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.Category,
                    p.ImageUrl
                })
                .ToListAsync();

            return Ok(products);
        }

    }
}
