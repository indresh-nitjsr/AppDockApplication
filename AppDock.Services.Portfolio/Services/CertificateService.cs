using AppDock.Services.PortfolioAPI.Data;
using AppDock.Services.PortfolioAPI.Models;
using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace AppDock.Services.PortfolioAPI.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly ApplicationDbContext _context;

        public CertificateService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> AddCertificateAsync(CertificateDto certificateDto)
        {
            if (certificateDto == null)
                throw new ArgumentNullException(nameof(certificateDto));

            var certificate = new Certificate
            {
                Id = Guid.NewGuid().ToString(),
                PortfolioId = certificateDto.PortfolioId,
                Title = certificateDto.Title,
                Issuer = certificateDto.Issuer,
                IssueDate = certificateDto.IssueDate,
                ExpiryDate = certificateDto.ExpiryDate,
                Description = certificateDto.Description,
                CertificateUrl = certificateDto.CertificateUrl
            };

            await _context.certificates.AddAsync(certificate);
            await _context.SaveChangesAsync();

            return $"Certificate '{certificate.Title}' added successfully.";
        }

        public async Task<string> DeleteCertificateAsync(string id)
        {
            var certificate = await _context.certificates.FindAsync(id);

            if (certificate == null)
                return "Certificate not found.";

            _context.certificates.Remove(certificate);
            await _context.SaveChangesAsync();

            return $"Certificate with ID '{id}' deleted successfully.";
        }

        public async Task<CertificateDto> GetCertificateByIdAsync(string certificateId)
        {
            var certificate = await _context.certificates.FindAsync(certificateId);

            if (certificate == null)
                return null;

            var dto = new CertificateDto
            {
                Id = certificate.Id,
                PortfolioId = certificate.PortfolioId,
                Title = certificate.Title,
                Issuer = certificate.Issuer,
                IssueDate = certificate.IssueDate,
                ExpiryDate = certificate.ExpiryDate,
                Description = certificate.Description,
                CertificateUrl = certificate.CertificateUrl
            };

            return dto;
        }

        public async Task<IEnumerable<CertificateDto>> GetCertificatesAsync(string portfolioId)
        {
            var certificates = await _context.certificates
                .Where(p => p.PortfolioId == portfolioId)
                .ToListAsync();

            var dtos = certificates.Select(c => new CertificateDto
            {
                Id = c.Id,
                PortfolioId = c.PortfolioId,
                Title = c.Title,
                Issuer = c.Issuer,
                IssueDate = c.IssueDate,
                ExpiryDate = c.ExpiryDate,
                Description = c.Description,
                CertificateUrl = c.CertificateUrl
            }).ToList();

            return dtos;
        }

        public async Task<string> UpdateCertificateAsync(string id, CertificateDto certificateDto)
        {
            var certificate = await _context.certificates.FindAsync(id);

            if (certificate == null)
                return "Certificate not found.";

            certificate.Title = certificateDto.Title;
            certificate.Issuer = certificateDto.Issuer;
            certificate.IssueDate = certificateDto.IssueDate;
            certificate.ExpiryDate = certificateDto.ExpiryDate;
            certificate.Description = certificateDto.Description;
            certificate.CertificateUrl = certificateDto.CertificateUrl;

            _context.certificates.Update(certificate);
            await _context.SaveChangesAsync();

            return $"Certificate '{certificate.Title}' updated successfully.";
        }
    }
}
