namespace API.Errors
{
    public class ValidationErrorResponse : ApiResponse
    {
        public IEnumerable<string> Errors { get; set; }

        public ValidationErrorResponse() : base(400)
        {
        }
    }
}