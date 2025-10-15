using FluentValidation;
using ShopVerse.Models;

namespace ShopVerse.Validators
{
    public class ProductValidator : AbstractValidator<Product>
    {
        public ProductValidator()
        {
            RuleFor(p => p.Name).NotEmpty(); // Must have name
            RuleFor(p => p.Price).GreaterThan(0); // Price > 0
            RuleFor(p => p.StockQuantity).GreaterThanOrEqualTo(0); // No negative stock
            RuleFor(p => p.Category).NotEmpty(); // Must have category
            RuleFor(p => p.ImageUrl).NotEmpty(); // Must have image URL

        }
    }
}
