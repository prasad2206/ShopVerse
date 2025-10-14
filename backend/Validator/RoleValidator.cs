using FluentValidation;
using ShopVerse.Models;

namespace ShopVerse.Validators
{
    public class RoleValidator : AbstractValidator<Role>
    {
        public RoleValidator()
        {
            RuleFor(r => r.Name).NotEmpty(); // Must have role name
        }
    }
}
