using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseController
    {
        [HttpGet]
        [Route("not-found")]
        public ActionResult GetNotFound()
        {
            return NotFound(); // e.g. something not found in the database
        }

        [HttpGet]
        [Route("bad-request")]
        public ActionResult GetBadRequest()
        {
            return BadRequest(new ProblemDetails { Title = "Bad Request", Status = 400 }); // e.g. tried to save something in the DB, but no change to previous data.
        }

        [HttpGet]
        [Route("unauthorised")]
        public ActionResult GetUnauthorised()
        {
            return Unauthorized(); // e.g. tried to access something that user not authorized to do something 
        }

        [HttpGet]
        [Route("validation-error")]
        public ActionResult GetValidationError()
        {
            ModelState.AddModelError("Problem 1", "This is Problem 1"); // e.g. form input value unvalid
            ModelState.AddModelError("Problem 2", "This is Problem 2");
            return ValidationProblem(); // returns array of all the validation problem occured when validating. i.e. Problem 1 and Prblem 2 
        }

        [HttpGet]
        [Route("server-error")]
        public ActionResult GetServerError()
        {
            throw new Exception("Server Error"); // Server ran into an error
        }

    }
}