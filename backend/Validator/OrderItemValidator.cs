using FluentValidation;
using ShopVerse.Models;

namespace ShopVerse.Validators
{
    public class OrderItemValidator : AbstractValidator<OrderItem>
    {
        public OrderItemValidator()
        {
            RuleFor(oi => oi.Quantity).GreaterThan(0); // Quantity > 0
            RuleFor(oi => oi.UnitPrice).GreaterThan(0); // Price > 0
        }
    }
}
