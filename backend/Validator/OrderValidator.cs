using FluentValidation;
using ShopVerse.Models;

namespace ShopVerse.Validators
{
    public class OrderValidator : AbstractValidator<Order>
    {
        public OrderValidator()
        {
            RuleFor(o => o.UserId).GreaterThan(0); // Must link to valid user
            RuleFor(o => o.TotalAmount).GreaterThan(0); // Amount > 0
        }
    }
}
