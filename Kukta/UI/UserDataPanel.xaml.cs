using Cooktapi.Networking;
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
            await User.SetRandomUserName();
            App.SwitchToMainPage(User.Permissions);
            SetLoading?.Invoke(false);
        }

        private async void LoginBTNClick(object sender, RoutedEventArgs e)
        {
            SetLoading?.Invoke(true);
            await User.ChangeUserName(UserNameTextBox.Text);
            App.SwitchToMainPage(User.Permissions);
            SetLoading?.Invoke(false);
        }

        private void UserNameTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            UpdateUsernameAvailable((sender as TextBox).Text);
        }
        private async Task UpdateUsernameAvailable(string username)
        {
            ErrorsStackList.Children.Clear();
            SubmitBTN.IsEnabled = false;
            ErrorsStackList.Children.Add(new ProgressRing()
            {
                IsActive = true,
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center,
            });

            ValidationTaskCancellationTokenSource?.Cancel();
            ValidationTaskCancellationTokenSource = new CancellationTokenSource();
            ValidationTaskCancellationToken = ValidationTaskCancellationTokenSource.Token;

            var task = Task.Run(async () =>
            {
                ValidationTaskCancellationToken.ThrowIfCancellationRequested();
                await Task.Delay(1500);
                ValidationTaskCancellationToken.ThrowIfCancellationRequested();
                var errors = await User.ValidateUsername(username);

                await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
                {
                    ErrorsStackList.Children.Clear();
                    if (errors.Count > 0)
                    {
                        foreach (string error in errors)
                        {
                            ErrorsStackList.Children.Add(GetErrorTextBlock("- " + error));
                        }
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
    }
}
