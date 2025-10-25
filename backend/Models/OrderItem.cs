namespace ShopVerse.Models
{
    public class OrderItem
    {
        public int Id { get; set; }                     // Primary key
        public int Quantity { get; set; }               // Quantity
        public decimal UnitPrice { get; set; }          // Unit price

        // Foreign keys
        public int OrderId { get; set; }               // Link to Order
        public int ProductId { get; set; }             // Link to Product

        // Navigation properties
        public Order Order { get; set; } = null!;     // Order navigation
        public Product Product { get; set; } = null!; // Product navigation
    }
}
