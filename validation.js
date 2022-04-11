                 
//Định nghĩa 1 hàm  Validator(),nó vừa là hàm vừa là Object
//cho tham số truyền vào là option={},là 1 objects
function Validator(options){  //truyền vào là 1 object : option = {...}
    console.log(options) // => form-1

//get thẻ cha gần nhất bao dc cả input và span lỗi|| vs selector tự ta cho  
    function getParent(element,selector){ 
        while(element.parentElement){ //tồn tại thẻ cha || vòng lặp while vô hạn cần 1 dk
            if(element.parentElement.matches(selector)){ 
                return element.parentElement //nếu đúng dk thì thoát loop
            }
            element=element.parentElement // Nếu element input ko thỏa if,thì gán th cha của input làm element luôn,và tiếp tục
                                          // tìm thằng cha của th cha này.Cho đến khi match dc vs selector mà ta cho.
        }
    }

    var selectorRules= {}; //giúp nhiều input dc nhiều rule test || phút 13 phần 2 của video

    //2.hàm để kiểm tra,bắt lỗi
    function validate(inputElement,rule){ //hàm này nằm trong foreach lặp qua rules[],nên ta nhận dc tham số rule
        var errorElement = getParent(inputElement,options.formGroupselector).querySelector(options.errorSelector) //lấy thẻ span ,class:"form-message"
        var errorMessage //= rule.test(inputElement.value) //trường hợp này chỉ cho mỗi input dc 1 rule test

        //biến rules này là các test,khác vs rules trong option{}
        var rules = selectorRules[rule.selector] //lấy ra các rules test của selector(console.log)
        console.log(rules) //  => [] || option.rules khác vs rules này


        //lặp qua từng rule và ktra
        //Nếu có lỗi thì dừng việc ktra
        for(var i =0 ;i <rules.length; ++i){ 
            switch(inputElement.type){ //nếu loại check là...
                case 'radio':
                case 'checkbox':
                    errorMessage=rules[i](
                        formElement.querySelector(rule.selector+ ':checked')
                    )
                    break;
                default:
                    errorMessage= rules[i](inputElement.value) //các rule sẽ nhận value và chạy hàm,sau đó trả về mess lỗi

            }
           // errorMessage=rules[i](inputElement.value) // <=> test()
            if(errorMessage) break; //nếu cái rule đầu tiên của 1selector báo lỗi thì ko cần ktra cái rule tiếp theo của selector đó
        }

        if(errorMessage) {
            errorElement.innerText = errorMessage  //khi có lỗi,errorMess lấy từ test(),cập nhật cho span
            getParent(inputElement,options.formGroupselector).classList.add('invalid')
        }
        else{
            errorElement.innerText ='';  //khi ko lỗi errorMessage="undefined"
            getParent(inputElement,options.formGroupselector).classList.remove('invalid')

        }
        return !errorMessage // cần giá trị true/false nên cần dấu phủ định ! __ có lỗi sẽ trả về true,ko lỗi trả về false
                             // tạo 1 biến isValid sẽ đổi ngc lại giá trị đúng ban đầu để console
                             // có lỗi sẽ báo true,ko lỗi sẽ báo false
    }



    //1.lấy element của form cần validate  || Mỗi lần lặp,gán = thì sẽ ghi đè
    var formElement =document.querySelector(options.form)//option.form => "form-1"  =>get hết <form>...</form>
    if(formElement){ 
        //Khi submit form 
        formElement.onsubmit=function(e){ //khi submit(chưa có nút bên html) form lên database thì...
            e.preventDefault(); //xóa mặc định chuyển trang

            var isFormValid = true; //biến của cả form ||mặc định cả form ko có lỗi,1 input lỗi biến này sẽ thành false
            //thực hiện lăp qua từng rule 1 và validate(những input ko hợp lệ sẽ báo lỗi)
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement,rule) // nhận giá trị từ errorMessage
                if(!isValid){ //nếu 1th có lỗi thì cả form sẽ báo false
                    isFormValid = false;
                }
            });
            if(isFormValid){ //true(ko lỗi)
                //TH submit vs javascript
                if(typeof options.onSubmit === "function"){  //kiểm tra đã đúng chuẩn fn hay chưa(k pải ktra đã đ/n hay chưa),123() =>lỗi
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')// Trả về nodelist nên k sử dụng dc pthuc của arr
                    console.log(enableInputs) //trả ra Nodelist gồm từng element trong form
                    var formValues=Array.from(enableInputs).reduce(function(values,input){
                        switch(input.type){ // phần này để chọn đúng value trả về cho checkbox
                            case 'radio':  //ko sử dung break nó sẽ sử dụng luôn case dưới
                                values[input.name]= formElement.querySelector('input[name="' +input.name+'"]:checked').value; 
                                break;
                            case 'checkbox': //checkbox là ô vuông-một lần dc chọn nhiều,radio là ô tròn chỉ chọn dc 1
                                if(!input.matches(':checked')){ //nếu ko checked
                                    values[input.name]=''
                                    return values;
                                }
                                    //values[input.name]= formElement.querySelector('input[name="' +input.name+'"]:checked').value; 
                                     //SET vào object values={ name:value,...} || Nối chuỗi
                                if(!Array.isArray(values[input.name])){
                                    values[input.name]=[] //gán cho cái key của object value là 1 arr
                                }
                                values[input.name].push(input.value)
                                break;
                            case 'file':
                                values[input.name]=input.files
                                break;
                            default:
                                values[input.name]= input.value;
                        }
                        return  values;
                        
                        //đưa value từ input vào values(giá trị tích lũy ban đầu là object rỗng)
                    },{})
                    //console.log(formValues)
                    options.onSubmit(formValues)
                    
                }
                else{
                    formElement.submit()
                }
            }
        }

        //lặp qua mỗi rule
        options.rules.forEach(function (rule){ //lặp qua mỗi object rule,mỗi input nếu nhiều rule test thì sẽ dc gán cho 1 arr rule test
            
            //Lưu lại các rule cho mỗi input(tránh trường hợp ghi đè từ onblur =) trường hợp 2 rule cho một input
                //selectorRules[rule.selector]= rule.test => lưu như này thì mỗi lần lặp chỉ lưu gán dc 1 giá trị,vì vậy cần
                // đặt rule.test trong [] để mỗi lần selectorRules[rule.selector] lưu dc 1 mảng(nhiều giá trị bên trong)
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }
            else{
                selectorRules[rule.selector] = [rule.test]// test này đặt trong 1 arr || 1 obj vs selector là key và value là 1 arr
                 //với lần lặp đầu tiên ứng vs dk else,key selector này chắc chắn ko pải [] 
                // ,nó sẽ dc gán với [] đầu tiên(là array mới chưa dc nhiều dữ liệu,nếu gán = sẽ bị ghiđè) => rule.selector=[rule.test],
                // lần lặp 2 thì nó đã là array thì nó sẽ đúng vs if() và dc push thêm rule.test tiếp theo vào
            }
            var inputElements=formElement.querySelectorAll(rule.selector) //get All thẻ input cùng name(ở đây là checkbox gender)
            Array.from(inputElements).forEach(function(inputElement){  //biến các giá trị thành 1 array
                inputElement.onblur=function(){ 
                    //console.log('blur' + rule.selector)
                     validate(inputElement,rule)
              } 
             //xử lí khi trường hợp ng dùng nhập vào input(ms nhập sẽ ko bị đỏ khi chưa đúng định dạng)
             inputElement.oninput=function(){
               var errorElement = getParent(inputElement,options.formGroupselector).querySelector('.form-message')
                errorElement.innerText ='';  
                inputElement.parentElement.classList.remove('invalid')
    
             }         
           })      
        });
        console.log(selectorRules) 
    }
}

                                //isRequired and isEmail là 2 cái rules(là 2 phương thức)
                                //Các qui tắc ktra và trả ra kết quả(lỗi hoặc ko)
//isRequired:("là bắt buộc")
//Nguyên tắc các rules:
//1:khi có lỗi trả ra message lỗi
//2:khi hợp lệ ko trả ra gì cả(undefined)
//tham số selector: là css selector
//hàm test : ktra ngdung bắt buộc nhập hoặc chưa nhập
Validator.isRequired = function(selector,message){  //hàm này ktra ng dùng nhập hay chưa || validator của cái input name
    return{ 
        selector:selector,  //#fullname 
        test:function(value){ //từ value =inputElement.value,ta ktra ng dùng đã nhập hay chưa
            return value ? undefined :message || 'Vui lòng nhập lại'  //trim() loại bỏ khoảng cách,dấu cách
        }
    }
}
Validator.isEmail=function(selector,message){ //hàm này ktra nhập vào có phải định dạng email ko || validator của email
    return { 
        selector:selector,
        test:function(value){  
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            return regex.test(value) ? undefined : message || "Vui lòng nhập email"  //test này khác test trên
        
        }
    }
}
Validator.minLength=function(selector,min,message){ //hàm này ktra nhập vào có phải định dạng email ko || validator của email
    return { 
        selector:selector,
        test:function(value){  
            return value.length >= min ? undefined : message || `vui lòng nhập tối thiểu ${min} ký tự`
        
        }
    }
}
Validator.isConfirmed = function(selector,getConfirmValue,message){
    return {
        selector:selector,
        test:function(value){ //value thẻ input confirm = với giá trị mà hàm getconfirmValue từ thẻ input password trả vể
            return value === getConfirmValue() ? undefined : message || 'giá trị nhập vào ko chính xác'
        }
    }
}


//selectorRules là một object đã được lưu tất cả các rule ,
//rule.selector sẽ biết được selector của mỗi rule từ các hàm Validator,
//selectorRules[rule.selector] bạn lấy ra được chính xác rule khi blur chuột ra ngoài


