using System;
using System.Collections.Generic;

namespace ShopVerse.Models
{
    public class Order
    {
        public int Id { get; set; }                     // Primary key
        public DateTime OrderDate { get; set; } = DateTime.UtcNow; // default order time
        public decimal TotalAmount { get; set; }       // Total amount
        public string Status { get; set; } = "Placed"; // default status
        public string? PaymentId { get; set; }  // optional, for tracking future payment gateway

        // Foreign key
        public int UserId { get; set; }                // Customer id

        // Navigation properties
        public User User { get; set; } = null!;       // User navigation
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>(); // Items
    }
}
