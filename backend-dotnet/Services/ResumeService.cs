using System.Text;
using Xceed.Words.NET;
using UglyToad.PdfPig;
using Microsoft.AspNetCore.Http;
using DocumentFormat.OpenXml.Packaging;

namespace WebAPI.Services
{
    public class ResumeService
    {
        public string ExtractText(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLower();

            using var stream = file.OpenReadStream();

            return extension switch
            {
                ".pdf" => ExtractPdfText(stream),
                ".docx" => ExtractDocxText(stream),
                _ => throw new NotSupportedException("Unsupported file format")
            };
        }

        private string ExtractPdfText(Stream stream)
        {
            var sb = new StringBuilder();

            using var pdf = PdfDocument.Open(stream);
            foreach (var page in pdf.GetPages())
            {
                sb.AppendLine(page.Text);
            }

            return sb.ToString();
        }

        public string ExtractDocxText(Stream stream)
        {
            using var ms = new MemoryStream();
            stream.CopyTo(ms);
            ms.Position = 0;

            var sb = new StringBuilder();

            using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(ms, false))
            {
                var body = wordDoc.MainDocumentPart.Document.Body;
                sb.Append(body.InnerText);
            }

            return sb.ToString();
        }
    }
}
