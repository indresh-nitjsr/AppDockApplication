using AppDock.Services.PortfolioAPI.Data;
using AppDock.Services.PortfolioAPI.Models;
using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace AppDock.Services.PortfolioAPI.Services
{
    public class ContactService : IContactService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ContactService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<string> AddOrUpdateContactAsync(ContactDto contactDto)
        {
            try
            {
                // Fix CS1513 and CS1061: Correct syntax and use LINQ with async methods
                var contact = await _context.contact
                    .FirstOrDefaultAsync(c => c.PortfolioId == contactDto.PortfolioId);

                if (contact == null)
                {
                    // Create new Contact
                    contact = new Contact
                    {
                        Address = contactDto.Address,
                        LinkedInUrl = contactDto.LinkedInUrl,
                        GitHubUrl = contactDto.GitHubUrl,
                        TwitterUrl = contactDto.TwitterUrl,
                        UserId = contactDto.UserId,
                        PortfolioId = contactDto.PortfolioId
                    };
                    if (string.IsNullOrEmpty(contact.Id))
                    {
                        contact.Id = Guid.NewGuid().ToString();
                    }
                    await _context.contact.AddAsync(contact);
                    await _context.SaveChangesAsync();
                    return "Contact created successfully!";
                }
                else
                {
                    // Update existing Contact
                    contact.Address = contactDto.Address;
                    contact.LinkedInUrl = contactDto.LinkedInUrl;
                    contact.GitHubUrl = contactDto.GitHubUrl;
                    contact.TwitterUrl = contactDto.TwitterUrl;
                    contact.UserId = contactDto.UserId;
                    contact.PortfolioId = contactDto.PortfolioId;

                    _context.contact.Update(contact);
                    await _context.SaveChangesAsync();
                    return "Contact updated successfully!";
                }
            }
            catch (Exception ex)
            {
                return $"Failed to add/update Contact: {ex.Message}";
            }
        }

        public async Task<ContactDto> GetContactAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new ArgumentException("UserId ID cannot be null or empty.", nameof(userId));
            }
            try
            {
                var contact = await _context.contact
                .FirstOrDefaultAsync(a => a.UserId == userId);

                if (contact == null)
                    return null;

                var contactDto = new ContactDto
                {
                    PortfolioId = contact.PortfolioId,
                    UserId = contact.UserId,
                    Address = contact.Address,
                    LinkedInUrl = contact.LinkedInUrl,
                    GitHubUrl = contact.GitHubUrl,
                    TwitterUrl = contact.TwitterUrl
                };
                return contactDto;
            }catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while retrieving the contact.", ex);
            }
        }


    }
}
