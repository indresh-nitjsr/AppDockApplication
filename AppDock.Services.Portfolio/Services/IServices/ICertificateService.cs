using AppDock.Services.PortfolioAPI.Models.DTO;

namespace AppDock.Services.PortfolioAPI.Services.IServices
{
    public interface ICertificateService
    {
        Task<IEnumerable<CertificateDto>> GetCertificatesAsync(string portfolioId);
        Task<string> AddCertificateAsync(CertificateDto certificate);
        Task<string> DeleteCertificateAsync(string id);
        Task<string> UpdateCertificateAsync(string id, CertificateDto certificate);
        Task<CertificateDto> GetCertificateByIdAsync(string id);
    }
}
