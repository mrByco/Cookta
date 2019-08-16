using Cooktapi.Food;
using Cooktapi.Measuring;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The User Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234236

namespace Kukta.UI
{
    public delegate void IngredientAddedEvent(Ingredient added);
    public delegate void IngredientRemovedEvent(Ingredient removed);
    public sealed partial class IngrtedientListControl : UserControl, INotifyPropertyChanged
    {
        public IngrtedientListControl()
        {
            this.InitializeComponent();

        }
        public event IngredientAddedEvent OnIngredientAdded;
        public event IngredientRemovedEvent OnIngredientRemoved;
        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
        private bool m_EditMode;
        public bool EditMode
        {
            get
            {
                return m_EditMode;
            }
            set
            {
                m_EditMode = value;
                OnPropertyChanged("EditMode");
            }
        }
        private string m_Title = "TitleText";
        public string Title
        {
            get
            {
                return m_Title;
            }
            set
            {
                m_Title = value;
                OnPropertyChanged("Title");
            }
        }


        private readonly ObservableCollection<Ingredient> m_Ingredients = new ObservableCollection<Ingredient>();
        private ObservableCollection<Ingredient> Ingredients { get { return m_Ingredients; } }

        public async void SetItems(List<Ingredient> ingredients)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                m_Ingredients.Clear();
                foreach (Ingredient ing in ingredients)
                {
                    m_Ingredients.Add(ing);
                }
            });
        }
        public List<Ingredient> GetIngredients()
        {
            return m_Ingredients.ToList();
        }


        private void removeBTNClick(Ingredient ing)
        {
            Ingredients.Remove(ing);
            OnIngredientRemoved?.Invoke(ing);
        }

        private void ListView_ItemClick(object sender, ItemClickEventArgs e)
        {
            Flyout flyout = new Flyout();

            StackPanel flyoutStack = new StackPanel() { Orientation = Orientation.Vertical, Spacing = 10, Margin = new Thickness(10) };
            flyout.Content = flyoutStack;

            TextBlock title = new TextBlock() { Text = "Biztos törlöd?", FontSize = 20, HorizontalAlignment = HorizontalAlignment.Left };
            flyoutStack.Children.Add(title);


            StackPanel buttonsStack = new StackPanel() { Orientation = Orientation.Horizontal, Spacing = 10 };
            flyoutStack.Children.Add(buttonsStack);

            Button AcceptBTN = new Button() { Content = "Törlés" };
            buttonsStack.Children.Add(AcceptBTN);
            AcceptBTN.Click += (s, args) => { removeBTNClick(e.ClickedItem as Ingredient); } ;
            AcceptBTN.Click += (s, args) => { flyout.Hide(); };

            Button CancelBTN = new Button() { Content = "Mégse" };
            buttonsStack.Children.Add(CancelBTN);
            CancelBTN.Click += (s, args) => { flyout.Hide(); };

            flyout.ShowAt(sender as FrameworkElement);
        }

        private void IngredientAdderControl_OnIngredeintAdded(Ingredient added)
        {
            Ingredients.Add(added);
            OnIngredientAdded?.Invoke(added);
        }
    }
}
