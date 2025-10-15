using Microsoft.AspNetCore.Http;

namespace ShopVerse.Services
{
    public interface IImageService
    {
        Task<string> SaveImageAsync(IFormFile file);   // Save image → return relative path
        Task<bool> DeleteImageAsync(string imageUrl);  // Delete image → return success
    }
}
