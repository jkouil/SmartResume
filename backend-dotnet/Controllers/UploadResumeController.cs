using Microsoft.AspNetCore.Mvc;
using WebAPI.Services;
using WebAPI.Models;
using Microsoft.AspNetCore.Cors;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowFrontend")]
    public class UploadResumeController : ControllerBase
    {
        private readonly ResumeService _resumeService = new();
        private readonly PythonService _pythonService = new();

        [HttpPost]
        [Route("analyze")]
        public async Task<IActionResult> AnalyzeResume(
            IFormFile jobFile,
            IFormFile resumeFile)
        {
            if (jobFile == null || resumeFile == null)
            {
                return BadRequest("Both job description and resume files are required.");
            }

            // 验证扩展名
            var allowedExtensions = new[] { ".pdf", ".docx" };
            var jobExt = Path.GetExtension(jobFile.FileName).ToLower();
            var resumeExt = Path.GetExtension(resumeFile.FileName).ToLower();

            if (!allowedExtensions.Contains(jobExt) || !allowedExtensions.Contains(resumeExt))
            {
                return BadRequest("Only .pdf and .docx files are allowed.");
            }

            // 提取文本内容
            var jobText = _resumeService.ExtractText(jobFile);
            var resumeText = _resumeService.ExtractText(resumeFile);

            // 调用 Python 分析服务
            var result = await _pythonService.AnalyzeWithPythonAsync(resumeText, jobText);

            return Ok(result);
        }
    }
}
