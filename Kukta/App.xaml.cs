
using Kukta.Calendar;
using Kukta.FoodFramework;
using Kukta.Menu;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.ApplicationModel;
using Windows.ApplicationModel.Activation;
using Windows.Data.Xml.Dom;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Notifications;
using Windows.UI.ViewManagement;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

namespace Kukta
{
    //Base delegates
    public delegate void VoidDelegate();
    public delegate void WeekTemplateDelegate(WeekTemplate template);
    public delegate void DayDelegate(CalendarDay day);
    public delegate ContentDialog DialogDelegate(ContentDialog baseDialog);

    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    sealed partial class App : Application
    {
        public const string BaseFoodRoot = "Assets/Foods";
        public const string CustomFoodRoot = "CustomFoods";
        public const string CustomCategoryRoot = "CustomCategories";
        public const string TemplateRoot = "WeekTemplates";
        public const string CalendarRoot = "Calendar";


        public static App instance;

        internal FoodDatabase FoodDatabase;
        internal TemplateManager TemplateDatabase;
        internal static Calendar.Calendar Calendar;
        internal static InitPage InitPage;
        internal static MainPage RootPage;

        internal static RestClient RestClient;


        public App()
        {
            
            this.InitializeComponent();
            this.Suspending += OnSuspending;

        }

        /// <summary>
        /// Invoked when the application is launched normally by the end user.  Other entry points
        /// will be used such as when the application is launched to open a specific file.
        /// </summary>
        /// <param name="e">Details about the launch request and process.</param>
        protected override void OnLaunched(LaunchActivatedEventArgs e)
        {
            Frame rootFrame = Window.Current.Content as Frame;



            var titleBar = ApplicationView.GetForCurrentView().TitleBar;
            titleBar.BackgroundColor = Windows.UI.Colors.Blue;
            titleBar.ButtonBackgroundColor = Windows.UI.Colors.Blue;
            // Do not repeat app initialization when the Window already has content,
            // just ensure that the window is active
            if (rootFrame == null)
            {

                // Create a Frame to act as the navigation context and navigate to the first page
                rootFrame = new Frame();

                rootFrame.NavigationFailed += OnNavigationFailed;

                if (e.PreviousExecutionState == ApplicationExecutionState.Terminated)
                {
                    //TODO: Load state from previously suspended application
                }

                // Place the frame in the current Window
                Window.Current.Content = rootFrame;
            }

            if (e.PrelaunchActivated == false)
            {
                if (rootFrame.Content == null)
                {
                    // When the navigation stack isn't restored navigate to the first page,
                    // configuring the new page by passing required information as a navigation
                    // parameter
                    rootFrame.Navigate(typeof(InitPage), e.Arguments);
                    InitPage = rootFrame.Content as InitPage;
                }
                // Ensure the current window is active
                Window.Current.Activate();
            }

        }

        public static void SwapToInitPage()
        {
            Frame rootFrame = Window.Current.Content as Frame;
            rootFrame.Navigate(typeof(InitPage), "LOGOUT");
            InitPage = rootFrame.Content as InitPage;
        }
        public static void SwapToRootPage()
        {
            Frame rootFrame = Window.Current.Content as Frame;
            rootFrame.Navigate(typeof(MainPage), null);
            RootPage = rootFrame.Content as MainPage;
        }

        /// <summary>
        /// Invoked when Navigation to a certain page fails
        /// </summary>
        /// <param name="sender">The Frame which failed navigation</param>
        /// <param name="e">Details about the navigation failure</param>
        void OnNavigationFailed(object sender, NavigationFailedEventArgs e)
        {
            throw new Exception("Failed to load Page " + e.SourcePageType.FullName);
        }

        /// <summary>
        /// Invoked when application execution is being suspended.  Application state is saved
        /// without knowing whether the application will be terminated or resumed with the contents
        /// of memory still intact.
        /// </summary>
        /// <param name="sender">The source of the suspend request.</param>
        /// <param name="e">Details about the suspend request.</param>
        private void OnSuspending(object sender, SuspendingEventArgs e)
        {
            var deferral = e.SuspendingOperation.GetDeferral();
            //TODO: Save application state and stop any background activity
            deferral.Complete();
        }
        public static void Sendnotification(string Title, string Message)
        {
            // template to load for showing Toast Notification
            var xmlToastTemplate = "<toast launch=\"app-defined-string\">" +
                                     "<visual>" +
                                       "<binding template =\"ToastGeneric\">" +
                                         "<text>" + Title + "</text>" +
                                         "<text>" +
                                           Message +
                                         "</text>" +
                                       "</binding>" +
                                     "</visual>" +
                                   "</toast>";

            // load the template as XML document
            var xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(xmlToastTemplate);

            // create the toast notification and show to user
            var toastNotification = new ToastNotification(xmlDocument);
            var notification = ToastNotificationManager.CreateToastNotifier();
            notification.Show(toastNotification);
        }

    }



        /*//Cloud thinks..
        private static string Tenant = "kukta.onmicrosoft.com";
        private static string ClientId = "4b7e5d88-ba84-426c-bba5-7492a7f76762";
        public static string PolicySignUpSignIn = "B2C_1_create_user";
        public static string PolicyEditProfile = "nothink";
        public static string PolicyResetPassword = "nothink";

        public static string[] ApiScopes = {
            "https://kukta.onmicrosoft.com/kuktapi/user_impersonation"//,
           // "https://kukta.onmicrosoft.com/kuktawebapi/write",
           // "https://kukta.onmicrosoft.com/kuktawebapi/read",
           // "https://kukta.onmicrosoft.com/kuktawebapi/user_impersonation",
        };//"https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read" };
        public static string ApiEndpoint = "";//"https://fabrikamb2chello.azurewebsites.net/hello";

        private static string BaseAuthority = "https://login.microsoftonline.com/tfp/{tenant}/{policy}/oauth2/v2.0/authorize";
        public static string Authority = BaseAuthority.Replace("{tenant}", Tenant).Replace("{policy}", PolicySignUpSignIn);
        public static string AuthorityEditProfile = BaseAuthority.Replace("{tenant}", Tenant).Replace("{policy}", PolicyEditProfile);
        public static string AuthorityResetPassword = BaseAuthority.Replace("{tenant}", Tenant).Replace("{policy}", PolicyResetPassword);

        public static PublicClientApplication PublicClientApp { get; } = new PublicClientApplication(ClientId, Authority, new TokenCache());*/
}
