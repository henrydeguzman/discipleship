<gt-datepicker
    on-change="gtwdCntntCtrl.graph.filterdate"
    input-model="gtwdCntntCtrl.graph.form.startdate"
    gt-options="{date:gtwdCntntCtrl.graph.form.startdate}"
    format="yyyy-MM-dd"></gt-datepicker>
</li>

optional parameters
1.on-change:function(date,gtoptions)
    - this will execute when the date is change, params will be the date selected.
2.input-model:string
    - when input is not empty the calendar will load depend on the provided data
3.gt-options:{date:'sample date display',opts:{}}
    - date: displayed text
    - opts: {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            }; for more reference : https://angular-ui.github.io/bootstrap/
4. id:string
    - this will another params on on-change function.
5. dt:'2018-1-1'
    - this will be the starting date when the calendar pop's up. if undefined the calendar current date today will be the starting date.
6. min-date:'2018-1-1'
    - minimum date available
7. max-date:'2018-1-2'
    - maximum date available
