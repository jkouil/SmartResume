using DocumentFormat.OpenXml.Wordprocessing;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using WebAPI.Models;

namespace WebAPI.Services
{
    public class PythonService
    {
        private readonly HttpClient _client = new();

        public async Task<ResumeAnalysisResult?> AnalyzeWithPythonAsync(string resumeText, string jobText)
        {
            var payload = new
            {
                resume = resumeText,
                job = jobText
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            try
            {
                var response = await _client.PostAsync("http://localhost:5000/analyze", content);
                response.EnsureSuccessStatusCode();

                var responseText = await response.Content.ReadAsStringAsync();

                var result = JsonSerializer.Deserialize<ResumeAnalysisResult>(responseText);

                //  ���ж� Score == 0������ֻ���ֶ��Ƿ�ȱʧ
                if (result == null || result.Summary == null)
                {
                    Console.WriteLine("[PythonService] LLM response is invalid or missing expected fields.");
                    return new ResumeAnalysisResult
                    {
                        Score = 0,
                        Summary = "Analysis failed or LLM returned invalid format."
                    };
                }

                Console.WriteLine($"[PythonService] Score: {result.Score}, Summary: {result.Summary}");
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PythonService] Error calling Python API: {ex.Message}");
                return new ResumeAnalysisResult
                {
                    Score = 0,
                    Summary = "Error contacting analysis service."
                };
            }

        }
    }
}
