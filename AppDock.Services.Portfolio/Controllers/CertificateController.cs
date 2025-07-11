using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppDock.Services.PortfolioAPI.Controllers
{
    [Route("api/certificates")]
    [ApiController]
    public class CertificateController : ControllerBase
    {
        private readonly ICertificateService _certificateService;

        public CertificateController(ICertificateService certificateService)
        {
            _certificateService = certificateService;
        }

        [HttpGet("portfolio/portfolioId")]
        public async Task<IActionResult> GetCertificates(string portfolioId)
        {
            if (string.IsNullOrWhiteSpace(portfolioId))
                return BadRequest("Portfolio ID is required.");

            var certificates = await _certificateService.GetCertificatesAsync(portfolioId);

            if (certificates == null || !certificates.Any())
                return NotFound("No certificates found for this portfolio.");

            return Ok(certificates);
        }

        [HttpPost]
        public async Task<IActionResult> AddCertificate([FromBody] CertificateDto certificateDto)
        {
            if (certificateDto == null)
                return BadRequest("Certificate data cannot be null.");

            var result = await _certificateService.AddCertificateAsync(certificateDto);

            return Ok(new { message = result });
        }

        [HttpDelete("{certificateId}")]
        public async Task<IActionResult> DeleteCertificate(string certificateId)
        {
            var result = await _certificateService.DeleteCertificateAsync(certificateId);

            return Ok(new { message = result });
        }

        [HttpPut("{certificateId}")]
        public async Task<IActionResult> UpdateCertificate(string certificateId, [FromBody] CertificateDto certificateDto)
        {
            if (certificateDto == null)
                return BadRequest("Certificate data cannot be null.");

            var result = await _certificateService.UpdateCertificateAsync(certificateId, certificateDto);

            return Ok(new { message = result });
        }

        [HttpGet("{certificateId}")]
        public async Task<IActionResult> GetCertificateById(string certificateId)
        {
            var certificate = await _certificateService.GetCertificateByIdAsync(certificateId);

            if (certificate == null)
                return NotFound($"Certificate with ID {certificateId} not found.");

            return Ok(certificate);
        }
    }
}
