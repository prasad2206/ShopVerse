using FluentValidation;
using ShopVerse.Models;

namespace ShopVerse.Validators
{
    public class OrderValidator : AbstractValidator<Order>
    {
        public OrderValidator()
        {
            RuleFor(o => o.UserId)
                .GreaterThan(0) // UserId must be > 0
                .WithMessage("Invalid UserId. Must be a valid registered user.");

            RuleFor(o => o.TotalAmount)
                .GreaterThan(0) // Order total must be > 0
                .WithMessage("Order total must be greater than zero.");

            RuleForEach(o => o.OrderItems)
                .SetValidator(new OrderItemValidator()); // Validate each item with OrderItemValidator
        }

    }
}
