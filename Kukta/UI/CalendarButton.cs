using Cooktapi.Calendar;
using Cooktapi.Food;
using Cooktapi.Calendar;
using Kukta.Screens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace Kukta.UI
{
    public class CalendarButton : Grid
    {
        public CalendarDay Day;
        public IMealingItem Item
        {
            get
            {
                return ItemIndex == null ? null : Mealing.items[(int)ItemIndex];
            }
            set
            {
                if (ItemIndex == null && Mealing.items.Contains(value))
                {
                    ItemIndex = Mealing.items.IndexOf(value);
                }
                else if (ItemIndex == null)
                {
                    Mealing.items.Add(value);
                    ItemIndex = Mealing.items.IndexOf(value);
                }
                else if (ItemIndex != null)
                {
                    Mealing.items[(int)ItemIndex] = value;
                }
            }
        }
        private int? ItemIndex;
        public Mealing Mealing;
        public MenuFlyout Flyout;
        public Action<CalendarDay> RefreshDay;
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        public StackPanel Parent;
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        public CalendarButton(ref Mealing mealing, ref CalendarDay day, int? itemIndex, MenuFlyout flyout, Action<CalendarDay> refreshDay, StackPanel parent, bool ChangeToItemAdderImmidiatelly)
        {
            base.Margin = new Thickness(0, 5, 0, 5);
            Mealing = mealing;
            Day = day;
            ItemIndex = itemIndex;
            Flyout = flyout;
            RefreshDay = refreshDay;
            Parent = parent;
            if (ChangeToItemAdderImmidiatelly)
                ChangeToItemSetter();
            else
                UpdateButton();
        }
        private void UpdateButton()
        {
            base.Children.Clear();
            Button btn = new Button()
            {
                HorizontalAlignment = HorizontalAlignment.Stretch,
                Margin = new Thickness(10, 2, 10, 2),
            };
            btn.Click += BTN_Click;

            if (Item is null)
            {
                btn.Content = "-";
            }
            else if (Item is Food food)
            {
                btn.Content = Item.GetMealFood().GetName();
            }
            else if (Item is Flag)
            {
                btn.Content = Item.GetName();
            }

            base.Children.Add(btn);
        }
        private void UpdateProgressRing()
        {
            base.Children.Clear();
            var ring = new ProgressRing()
            {
                IsActive = true,
                HorizontalAlignment = HorizontalAlignment.Stretch,
                VerticalAlignment = VerticalAlignment.Stretch,
            };
            base.Children.Add(ring);
        }

        private void BTN_Click(object sender, RoutedEventArgs e)
        {
            Flyout.Items.Clear();
            if (Item != null)
            {
                var ReplaceItem = new MenuFlyoutItem();
                ReplaceItem.Text = "Csere";
                ReplaceItem.Click += ReplaceMealingItemClick;
                Flyout.Items.Add(ReplaceItem);

                var DeleteItem = new MenuFlyoutItem();
                DeleteItem.Text = "Törlés";
                DeleteItem.Click += RemoveMealingItemClick;
                Flyout.Items.Add(DeleteItem);
            }
            var AddItem = new MenuFlyoutItem();
            AddItem.Text = "Hozzáadás";
            AddItem.Click += AddNewMealingItemClick;
            Flyout.Items.Add(AddItem);
            if (Item is Food food)
            {
                var JumpToItem = new MenuFlyoutItem();
                JumpToItem.Text = "Ugrás";
                JumpToItem.Click += JumpToItemClick;
                Flyout.Items.Add(JumpToItem);
            }
            if (Item is Flag flag)
            {
                var UpdateItem = new MenuFlyoutItem();
                UpdateItem.Text = "Frissítés";
                UpdateItem.Click += RefreshFlagSeedClick;
                Flyout.Items.Add(UpdateItem);
            }
            Flyout.ShowAt(this);
        }
        internal void AddNewMealingItemClick(object sender, RoutedEventArgs e)
        {
            if (Item == null)
                ChangeToItemSetter();
            else
                CalendarContentPage.AddNewMealingItemToStack(Parent, ref Mealing, ref Day, Flyout, RefreshDay);
        }
        internal void RefreshFlagSeedClick(object sender, RoutedEventArgs e)
        {
            UpdateProgressRing();
            Task.Run(async() =>
            {
                if (Item is Flag flag)
                {
                    Item.NewSeed();
                    await(Item as Flag).Init();
                    await CalendarDay.SaveDay(Day);
                    await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () => { UpdateButton(); });
                }
            });
        }
        private void ReplaceMealingItemClick(object sender, RoutedEventArgs e)
        {
            if (Item == null)
                return;
            else
                ChangeToItemSetter();
        }
        private void RemoveMealingItemClick(object sender, RoutedEventArgs e)
        {
            if (Item == null)
                return;
            else
            {
                Mealing.items.Remove(Item);
                RefreshDay.Invoke(Day);
#pragma warning disable CS4014
                CalendarDay.SaveDay(Day);
#pragma warning restore CS4014
            }
        }
        private void UpdateItemClick(object sender, RoutedEventArgs e)
        {
            if (Item is Flag flag)
            {
                flag.NewSeed();
                UpdateProgressRing();
                Task.Run(async () =>
                {
                    await CalendarDay.SaveDay(Day);
                    await flag.Init();
                    UpdateButton();
                });
            }
        }
        private void JumpToItemClick(object sender, RoutedEventArgs e)
        {
            if (Item is Food food)
            {
                MainPage.NavigateTo("fooddetail", null, food._id);
            }
        }
        private void ChangeToItemSetter()
        {
            base.Children.Clear();

            AutoSuggestBox setter = GetItemSetter();
            base.Children.Add(setter);
            setter.Focus(FocusState.Pointer);
        }
        private AutoSuggestBox GetItemSetter()
        {
            AutoSuggestBox suggBox = new AutoSuggestBox()
            {
                PlaceholderText = "Étel vagy kategória",
                HorizontalAlignment = HorizontalAlignment.Stretch,
                Margin = new Thickness(10, 0, 10, 0),
            };
            suggBox.LostFocus += (sender, args) =>
            {
                RefreshDay(Day);
            };
            Action setItems = async () =>
            {
                List<IMealingItem> items = await Food.GetSubAndMyFoods();
                items.AddRange(Flag.GetAvailableFlags());
                suggBox.TextChanged += (box, args) =>
                {
                    var filteredItems = items.FindAll((item) => { return item.ToString().ToLower().Contains(box.Text.ToLower()); });
                    box.ItemsSource = filteredItems;
                };
                suggBox.QuerySubmitted += async (box, args) =>
                {
                    IMealingItem choosenItem = (box.ItemsSource as List<IMealingItem>).Find((item) => { return item.ToString().Equals(args.QueryText); });
                    if (Item == null)
                    {
                        Mealing.items.Add(choosenItem);
                        Item = Mealing.items.Last();
                    }
                    else
                    {
                        Item = choosenItem;
                    }

                    if (Item is Flag)
                    {
                        UpdateProgressRing();
                        Item.NewSeed();
                        await (Item as Flag).Init();
                    }
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                    CalendarDay.SaveDay(Day);
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                    UpdateButton();
                };
            };
            Task.Run(setItems);
            return suggBox;
        }
    }
}
