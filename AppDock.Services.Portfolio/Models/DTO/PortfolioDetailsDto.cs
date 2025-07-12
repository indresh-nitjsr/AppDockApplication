namespace AppDock.Services.PortfolioAPI.Models.DTO
{
    public class PortfolioDetailsDto
    {
        public string Id { get; set; }

        public string Role { get; set; }

        public DateTime DOB { get; set; }

        public UserDto user { get; set; }

        public AboutDto About { get; set; }

        public IEnumerable<ProjectDto> Projects { get; set; }
      
        public IEnumerable<CertificateDto> Certificates { get; set; }

        public IEnumerable<SkillDto> Skills { get; set; }
        public IEnumerable<ExperienceDto> Experiences { get; set; }
    }
}
