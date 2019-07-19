using Kukta.FrameWork;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.UI
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class UserDataPanel : Page
    {
        public UserDataPanel()
        {
            this.InitializeComponent();
        }

        public CancellationTokenSource ValidationTaskCancellationTokenSource = new CancellationTokenSource();
        public CancellationToken ValidationTaskCancellationToken = new CancellationToken();

        public Action<bool> SetLoading;

        private async void NoLoginBTN_Click(object sender, RoutedEventArgs e)
        {
            SetLoading?.Invoke(true);
            bool userValid = false;
            string username = "notinitialized";
            while (!userValid)
            {
                username = "user" + new Random().Next(99999999);
                userValid = await CheckUsernameAvailable(username);
            }
            await Networking.ChangeUserInfo(username, null, null, Networking.GetClaim("email"), Networking.GetClaim("picture"));
            App.SwapToRootPage();
            SetLoading?.Invoke(false);
        }

        private async void LoginBTNClick(object sender, RoutedEventArgs e)
        {
            SetLoading?.Invoke(true);
            await Networking.ChangeUserInfo(UserNameTextBox.Text, null, null, Networking.GetClaim("email"), Networking.GetClaim("picture"));
            App.SwapToRootPage();
            SetLoading?.Invoke(false);
        }

        private void UserNameTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            var validation = (sender as TextBox).Text.IsValidUsername();
#pragma warning disable CS4014
            UpdateUsernameAvailable(validation, (sender as TextBox).Text);
#pragma warning restore CS4014 
        }
        private async Task UpdateUsernameAvailable(UsernameValidResult validationRes, string username)
        {
            ErrorsStackList.Children.Clear();
            SubmitBTN.IsEnabled = false;
            ErrorsStackList.Children.Add(new ProgressRing()
            {
                IsActive = true,
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center,
            });


            if (!validationRes.IsValid())
            {
                ErrorsStackList.Children.Clear();
                SubmitBTN.IsEnabled = false;
                if (!validationRes.CharacterCount)
                {
                    ErrorsStackList.Children.Add(GetErrorTextBlock("- A felhasználónév minimum 6 karakter, maximum 30."));
                }
                return;
            }
            ValidationTaskCancellationTokenSource?.Cancel();
            ValidationTaskCancellationTokenSource = new CancellationTokenSource();
            ValidationTaskCancellationToken = ValidationTaskCancellationTokenSource.Token;

            var task = Task.Run(async () =>
            {
                ValidationTaskCancellationToken.ThrowIfCancellationRequested();
                await Task.Delay(1500);
                ValidationTaskCancellationToken.ThrowIfCancellationRequested();
                var availability = await CheckUsernameAvailable(username);
                await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
                {
                    ErrorsStackList.Children.Clear();
                    if (!availability)
                    {
                        ErrorsStackList.Children.Add(GetErrorTextBlock("- Ez a név foglalt."));
                        SubmitBTN.IsEnabled = false;
                    }
                    else
                    {
                        SubmitBTN.IsEnabled = true;
                    }
                });

            }, ValidationTaskCancellationToken);
            await task;
        }
        public static TextBlock GetErrorTextBlock(string text)
        {
            var textBlock = new TextBlock()
            {
                HorizontalAlignment = HorizontalAlignment.Left,
                Margin = new Thickness(5),
                Foreground = new SolidColorBrush(Colors.Red),
                FontWeight = Windows.UI.Text.FontWeights.Bold,
                Text = text,
            };
            return textBlock;
        }
        public async Task<bool> CheckUsernameAvailable(string username)
        {
            var query = new Dictionary<string, object>();
            query.Add("username", username);
            var res = await Networking.GetRequestSimple("username", query);
            try
            {
                bool ava = bool.Parse(res.Content);
                return ava;
            }
            catch
            {
                return false;
            }
        }
    }
}
