using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace Kukta.UI
{
    public class UITools
    {
        public static Flyout GetSureFlyout(Action<object, RoutedEventArgs> onOk, string okText, Action<object, RoutedEventArgs> onCancel, string cancelText, string title, string desc)
        {
            Flyout flyout = new Flyout();

            StackPanel flyStack = new StackPanel() { Orientation = Orientation.Vertical, Spacing = 10, Margin = new Thickness(10) };
            flyout.Content = flyStack;

            TextBlock titleTextBlock = new TextBlock() { Text = title, FontSize = 20, HorizontalAlignment = HorizontalAlignment.Left };
            flyStack.Children.Add(titleTextBlock);

            TextBlock descTextBlock = new TextBlock() { Text = desc, FontSize = 14, HorizontalAlignment = HorizontalAlignment.Left, TextWrapping = TextWrapping.WrapWholeWords, MaxWidth = 300 };
            flyStack.Children.Add(descTextBlock);

            StackPanel buttonsStack = new StackPanel() { Orientation = Orientation.Horizontal, Spacing = 10 };
            flyStack.Children.Add(buttonsStack);

            Button AcceptBTN = new Button() { Content = okText };
            buttonsStack.Children.Add(AcceptBTN);
            AcceptBTN.Click += (sender, args) => { flyout.Hide(); };
            if (onOk != null)
                AcceptBTN.Click += (obj, args) => { onOk(obj, args); };

            Button CancelBTN = new Button() { Content = cancelText };
            buttonsStack.Children.Add(CancelBTN);
            CancelBTN.Click += (sender, args) => { flyout.Hide(); };
            if (onCancel != null)
                AcceptBTN.Click += (obj, args) => { onCancel(obj, args); };

            return flyout;
        }
    }
}
