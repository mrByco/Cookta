using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(KuktaService.Startup))]
namespace KuktaService
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
