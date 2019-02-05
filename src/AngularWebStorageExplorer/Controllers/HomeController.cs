using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.DirectoryServices.Protocols;
using AngularWebStorageExplorer.Models;

namespace AngularWebStorageExplorer.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
        public IActionResult Authenticate(User user)
        {
            string UserName = user.UserID;
            string Password = user.Password;
            bool credentialsValid = false;

            const int ldapErrorInvalidCredentials = 0x31;
            string activeDirectoryServer = "ldap.cogitate.us:636";
            string activeDirectoryDomain = "DC=cogitate,DC=us";
            try
            {
                LdapConnection ldapConnection = new LdapConnection(activeDirectoryServer);
                var networkCredential = new NetworkCredential(UserName, Password, activeDirectoryDomain);
                ldapConnection.SessionOptions.SecureSocketLayer = true;
                ldapConnection.SessionOptions.VerifyServerCertificate = new VerifyServerCertificateCallback((con, cer) => true);
                ldapConnection.AuthType = AuthType.Negotiate;
                ldapConnection.Bind(networkCredential);
                credentialsValid = true;
            }
            catch (LdapException ldapException)
            {
                // Invalid credentials throw an exception with a specific error code
                if (ldapException.ErrorCode.Equals(ldapErrorInvalidCredentials))
                {
                    credentialsValid = false;
                }
                else
                {
                    ViewBag.Exception = ldapException;
                    return View("Login");
                }
            }
            if(credentialsValid)
            {
                return RedirectToAction("Index");
            }
            else
            {
                ViewBag.Error = "Invalid Credentials";
                return View("Login");
            }
    }
}
}
