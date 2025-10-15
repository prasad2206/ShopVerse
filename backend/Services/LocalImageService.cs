using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace ShopVerse.Services
{
    public class LocalImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;

        public LocalImageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid image file");

            // Folder path → wwwroot/images/products
            var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "products");
            Directory.CreateDirectory(uploadsFolder);

            // Unique filename
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(stream);

            // Return relative URL
            return $"images/products/{fileName}";
        }

        public Task<bool> DeleteImageAsync(string imageUrl)
        {
            try
            {
                var fullPath = Path.Combine(_env.WebRootPath, imageUrl);
                if (File.Exists(fullPath))
                    File.Delete(fullPath);
                return Task.FromResult(true);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }
    }
}
