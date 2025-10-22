using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopVerse.Data;
using ShopVerse.Models;
using System.Security.Claims;

namespace ShopVerse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/orders → Place new order
        [Authorize] // only logged-in users can place order
        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderRequestDto dto)
        {
            if (dto == null || dto.Items == null || !dto.Items.Any())
                return BadRequest(new { message = "Order items cannot be empty." });

            // Get current user ID from token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
               ?? User.FindFirst("id")?.Value; // Adjust claim type as needed
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token");

            var userId = int.Parse(userIdClaim);


            // Create new Order
            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = dto.TotalAmount,
                Status = "Placed"
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Create order items
            foreach (var item in dto.Items)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Price
                };
                _context.OrderItems.Add(orderItem);
            }

            await _context.SaveChangesAsync();

            return Ok(new { orderId = order.Id, message = "Order placed successfully!" });
        }

        // GET: api/orders/{id} → Get specific order summary
        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound(new { message = "Order not found." });

            var response = new
            {
                order.Id,
                order.OrderDate,
                order.TotalAmount,
                order.Status,
                Customer = order.User.Name,
                Items = order.OrderItems.Select(oi => new
                {
                    oi.Id,
                    ProductName = oi.Product.Name,
                    oi.Quantity,
                    Price = oi.UnitPrice
                }).ToList()
            };

            return Ok(response);
        }

        // GET: api/orders (for admin) → all orders list 
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
               .Select(o => new
               {
                   o.Id,
                   o.OrderDate,
                   o.TotalAmount,
                   o.Status,
                   o.PaymentId,
                   Customer = new
                   {
                       Name = o.User.Name,
                       Email = o.User.Email
                   }
               })
                .ToListAsync();

            return Ok(orders);
        }

        //[Authorize]
        //[HttpGet("my")]
        //public async Task<IActionResult> GetMyOrders()
        //{
        //    try
        //    {
        //        // Extract user ID from JWT token claims
        //        var userIdClaim = User.FindFirst("id")?.Value
        //           ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        //           ?? User.FindFirst("nameid")?.Value;

        //        if (userIdClaim == null)
        //            return Unauthorized("User ID not found in token");

        //        var userId = int.Parse(userIdClaim);

        //        var myOrders = await _context.Orders
        //            .Include(o => o.OrderItems)
        //            .ThenInclude(oi => oi.Product)
        //            .Where(o => o.UserId == userId)
        //            .ToListAsync();

        //        return Ok(myOrders);
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log the exception details
        //        return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
        //    }
        //}

        //[Authorize(Roles = "Customer")]
        //[HttpGet("my")]
        //public async Task<IActionResult> GetMyOrders()
        //{
        //    try
        //    {
        //        var userIdClaim = User.FindFirst("id")?.Value
        //           ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        //           ?? User.FindFirst("nameid")?.Value;

        //        if (userIdClaim == null)
        //            return Unauthorized("User ID not found in token");

        //        if (!int.TryParse(userIdClaim, out var userId))
        //            return Unauthorized($"Invalid userIdClaim value: {userIdClaim}");

        //        var myOrders = await _context.Orders
        //            .Where(o => o.UserId == userId)
        //            .Include(o => o.OrderItems)
        //            .ThenInclude(oi => oi.Product)
        //            .Select(o => new
        //            {
        //                o.Id,
        //                o.OrderDate,
        //                o.TotalAmount,
        //                o.Status,
        //                Items = o.OrderItems.Select(oi => new
        //                {
        //                    oi.ProductId,
        //                    ProductName = oi.Product != null ? oi.Product.Name : "(Deleted Product)",
        //                    oi.Quantity,
        //                    oi.UnitPrice
        //                }).ToList()
        //            })
        //            .OrderByDescending(o => o.Id)
        //            .ToListAsync();

        //        return Ok(myOrders);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"GetMyOrders Error: {ex}");
        //        return StatusCode(500, new { message = "Server error", error = ex.Message });
        //    }
        //}

        [Authorize(Roles = "Customer")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userIdClaim = User.FindFirst("id")?.Value
               ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
               ?? User.FindFirst("nameid")?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Invalid or missing user ID in token" });

            var myOrders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.TotalAmount,
                    o.Status,
                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        ProductName = oi.Product != null ? oi.Product.Name : "(Deleted Product)",
                        oi.Quantity,
                        oi.UnitPrice
                    })
                })
                .OrderByDescending(o => o.Id)
                .ToListAsync();

            return Ok(myOrders);
        }


    }


    // DTO classes (request model)
    public class OrderRequestDto
    {
        public List<OrderItemDto> Items { get; set; } = new();
        public decimal TotalAmount { get; set; }
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
