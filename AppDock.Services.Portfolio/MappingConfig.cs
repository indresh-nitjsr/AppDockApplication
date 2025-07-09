using AppDock.PortfolioService.Models;
using AppDock.Services.PortfolioAPI.Models;
using AppDock.Services.PortfolioAPI.Models.DTO;
using AutoMapper;

namespace AppDock.Services.PortfolioAPI
{
    public class MappingConfig
    {
        public static MapperConfiguration RegisterMaps()
        {
            var MappingConfig = new MapperConfiguration(config =>
            {
                //portfolio mapper
                config.CreateMap<PortfolioDto, UserPortfolio>();
                config.CreateMap<UserPortfolio, PortfolioDto>();

                //About mapper
                config.CreateMap<AboutDto, About>();
                config.CreateMap<About, AboutDto>();

                //project mapper
                config.CreateMap<ProjectDto, Projects>();
                config.CreateMap<Projects, ProjectDto>();
            });
            return MappingConfig;
        }
    }
}
