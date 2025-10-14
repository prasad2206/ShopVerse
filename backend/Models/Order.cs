using System;
using System.Collections.Generic;

namespace ShopVerse.Models
{
    public class Order
    {
        public int Id { get; set; }                     // Primary key
        public DateTime OrderDate { get; set; }        // Order date
        public decimal TotalAmount { get; set; }       // Total amount

        // Foreign key
        public int UserId { get; set; }                // Customer id

        // Navigation properties
        public User User { get; set; } = null!;       // User navigation
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>(); // Items
    }
}
