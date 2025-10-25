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

            // Folder path → wwwroot/images/
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Images");
            Directory.CreateDirectory(uploadsFolder);

            // Unique filename
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            Console.WriteLine($"💾 Saving image at: {filePath}");

            using (var stream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(stream);

            // Return relative URL
            return $"/Images/{fileName}";
        }

        public Task<bool> DeleteImageAsync(string imageUrl)
        {
            try
            {
                // Ensure proper path — handle leading slashes ("/Images/abc.png")
                var trimmedPath = imageUrl.TrimStart('/'); // "Images/abc.png"

                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), trimmedPath);

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    Console.WriteLine($"🗑 Deleted old image: {fullPath}");
                }
                else
                {
                    Console.WriteLine($"⚠️ Old image not found for deletion: {fullPath}");
                }

                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error deleting image: {ex.Message}");
                return Task.FromResult(false);
            }
        }

    }
}
