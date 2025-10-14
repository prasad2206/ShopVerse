
using Microsoft.EntityFrameworkCore;
using ShopVerse.Models;

namespace ShopVerse.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

    }
}
