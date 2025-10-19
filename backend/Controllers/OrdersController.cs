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

        // ✅ POST: api/orders → Place new order
        [Authorize] // only logged-in users can place order
        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderRequestDto dto)
        {
            if (dto == null || dto.Items == null || !dto.Items.Any())
                return BadRequest(new { message = "Order items cannot be empty." });

            // ✅ Get current user ID from token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // ✅ Create new Order
            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = dto.TotalAmount,
                Status = "Placed"
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // ✅ Create order items
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

        // ✅ GET: api/orders/{id} → Get specific order summary
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

        // ✅ GET: api/orders (for admin) → all orders list 
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
    }

    // ✅ DTO classes (request model)
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
