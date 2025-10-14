namespace ShopVerse.DTOs
{
    public class ProductDto
    {
        public string Name { get; set; } = string.Empty; // Product name
        public string Description { get; set; } = string.Empty; // Description
        public decimal Price { get; set; } // Price
        public int StockQuantity { get; set; } // Stock qty
    }
}
