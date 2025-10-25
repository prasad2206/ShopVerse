namespace ShopVerse.Models
{
    public class Product
    {
        public int Id { get; set; }                       // Primary key
        public string Name { get; set; } = string.Empty;  // Product name
        public string Description { get; set; } = string.Empty; // Description
        public decimal Price { get; set; }                // Price
        public int StockQuantity { get; set; }            // Stock qty
        public string Category { get; set; } = string.Empty;     // Category name
        public string ImageUrl { get; set; } = string.Empty;     // Relative image path

        // Navigation property
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>(); // Related items
    }
}
