using Microsoft.AspNetCore.Mvc;
using ShopVerse.Models;
using ShopVerse.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace ShopVerse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private static readonly List<Product> _products = new()
        {
            new Product { Id = 1, Name = "Laptop", Price = 55000, Description = "Laptop", StockQuantity = 10 },
            new Product { Id = 2, Name = "Wireless Mouse", Price = 1200, Description = "Mouse", StockQuantity = 50 }
        };

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_products);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null)
                return NotFound();
            return Ok(product);
        }

        [Authorize(Roles = "Admin")] // Only Admin can add product
        [HttpPost]
        public IActionResult Create([FromBody] ProductDto dto)
        {
            // Map DTO → Model
            var product = new Product
            {
                Id = _products.Max(p => p.Id) + 1, // Auto-increment
                Name = dto.Name,                    // Map name
                Description = dto.Description,      // Map description
                Price = dto.Price,                  // Map price
                StockQuantity = dto.StockQuantity   // Map stock
            };

            _products.Add(product); // Add to list
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }
    }
}
