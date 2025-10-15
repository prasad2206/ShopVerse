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
        private readonly IImageService _imageService; // 🆕 image service

        public ProductsController(AppDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        // 🟢 GET: api/products → Get all products
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products.ToListAsync();  // Fetch all
            return Ok(products);
        }

        // 🟢 GET: api/products/{id} → Get product by ID
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products.FindAsync(id);   // Find product
            if (product == null)
                return NotFound(new { message = "Product not found" });

            return Ok(product);
        }

        // 🔒 POST: api/products → Add new product (Admin only)
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


        // 🔒 PUT: api/products/{id} → Update product (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = "Product not found" });

            // Update fields
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;
            product.Category = dto.Category;
            product.ImageUrl = dto.ImageUrl;

            await _context.SaveChangesAsync();       // Commit update
            return Ok(product);
        }

        // 🔒 DELETE: api/products/{id} → Delete product (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = "Product not found" });

            // 🆕 Delete associated image if exists
            if (!string.IsNullOrEmpty(product.ImageUrl))
                await _imageService.DeleteImageAsync(product.ImageUrl);

            _context.Products.Remove(product);       // Remove from DB
            await _context.SaveChangesAsync();       // Commit delete

            return Ok(new { message = "Product deleted successfully" });
        }

    }
}
