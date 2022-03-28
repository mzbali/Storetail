using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // the route to hit, [controller] represent the name of the controller class
    public class BaseController : ControllerBase
    {

    }
}