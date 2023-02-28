$(function () {
  $('#submit').click(function () {
    var filename = $("input[name='field1']").val();
    console.log(filename);
    $.ajax({
      type: 'GET',
      url: filename,
      dataType: 'xml',
    })
      .done(function (e) {
        console.log('Success');
        $('#result1').empty();
        $('#result2').empty();
        $('#result3').empty();
        table_show(e);
        xml_clone = e;
        create_button();
      })
      .fail(function (e) {
        alert('Ajax Error');
      });
  });

  function create_button() {
    $('#result2').empty();
    $('#result2').append(
      "<div><div class=button_wrap><button class=btn_line id='add'>追加</button> <button class=btn_line id='changes'>変更</button> <button class=btn_line id='delete'>削除</button> <button class=btn_line id='keep'>保存</button> <button class=btn_line id='search'>検索</button></div>",
      '<span id="log"></span></div>'
    );
  }

  /* start:追加 */
  $('#result2').on('click', '#add', function () {
    $('#result3').empty();
    $('#result3').append(
      '<p>' + '追加する製品の情報を入力してください' + '</p>'
    );
    $('#result3').append('製品名' + '<br/>');
    $('#result3').append(
      "<input type='text' name='product' size='40'><br><br>"
    );
    $('#result3').append('品番' + '<br/>');
    $('#result3').append(
      "<input type='text' name='partnumber' size='40'><br><br>"
    );
    $('#result3').append('種別' + '<br/>');
    $('#result3').append("<input type='text' name='kinds' size='40'><br><br>");
    $('#result3').append('保管場所' + '<br/>');
    $('#result3').append(
      "<input type='text' name='storagelocation' size='40'><br><br>"
    );
    $('#result3').append('個数' + '<br/>');
    $('#result3').append(
      "<input type='text' name='quantity' size='40'><br><br>"
    );
    $('#result3').append("<br><button id='add_input'>入力</button><br>");
  });

  $('#result3').on('click', '#add_input', function () {
    var product = $("input[name='product']").val();
    var partnumber = $("input[name='partnumber']").val();
    var kinds = $("input[name='kinds']").val();
    var storagelocation = $("input[name='storagelocation']").val();
    var quantity = $("input[name='quantity']").val();

    addstock(xml_clone, product, partnumber, kinds, storagelocation, quantity);
    table_show(xml_clone);
    console.log('add stock');
    wlog('在庫『' + product + '』を追加しました。');
    $('#result3').empty();
  });

  function addstock(e, tit, aut, pub, yea, pri) {
    var add_stock_tag = $('<stock></stock>');
    var add_product_tag = $('<product></product>').text(tit);
    var add_partnumber_tag = $('<partnumber></partnumber>').text(aut);
    var add_kinds_tag = $('<kinds></kinds>').text(pub);
    var add_storagelocation_tag = $('<storagelocation></storagelocation>').text(
      yea
    );
    var add_quantity_tag = $('<quantity></quantity>').text(pri);

    $(add_stock_tag).append(add_product_tag);
    $(add_stock_tag).append(add_partnumber_tag);
    $(add_stock_tag).append(add_kinds_tag);
    $(add_stock_tag).append(add_storagelocation_tag);
    $(add_stock_tag).append(add_quantity_tag);

    var last_stock_tag = $(e).find('stock').last();
    $(last_stock_tag).after(add_stock_tag);
  }
  /* end:追加 */

  /* start:変更 */
  $('#result2').on('click', '#changes', function () {
    var value = $("input[name='check']:checked").val() - 1;
    if (isNaN(value)) {
      wlog('エラー：製品を選択して変更ボタンを押してください。');
    }
    $(xml_clone)
      .find('stock')
      .each(function (i) {
        if (i == value) {
          var product_txt = $(this).find('product').text();
          var partnumber_txt = $(this).find('partnumber').text();
          var kinds_txt = $(this).find('kinds').text();
          var storagelocation_txt = $(this).find('storagelocation').text();
          var quantity_txt = Number(
            $(this).find('quantity').text()
          ).toLocaleString();
          $('#result3').empty();
          $('#result3').append('<div id="change">');
          $('#change').append(
            '<kinds for="productl">製品名 : </kinds><input type="text" name="product" id="productl" size="40" value=' +
              product_txt +
              '></input><br>'
          );
          $('#change').append(
            '<kinds for="partnumberl">品番 : </kinds><input type="text" name="partnumber" id="partnumberl" size="40" value=' +
              partnumber_txt +
              '></input><br>'
          );
          $('#change').append(
            '<kinds for="kindsl">種別 : </kinds><input type="text" name="kinds" id="kindsl" size="40" value=' +
              kinds_txt +
              '></input><br>'
          );
          $('#change').append(
            '<kinds for="storagelocationl">保管場所 : </kinds><input type="text" name="storagelocation" id="storagelocationl" size="40" value=' +
              storagelocation_txt +
              '></input><br>'
          );
          $('#change').append(
            '<kinds for="quantityl">個数 : </kinds><input type="text" name="quantity" id="quantityl" size="40" value=' +
              quantity_txt +
              '></input><br>'
          );
          $('#change').append("<button id='change_input'>変更</button>");
        }
      });
  });

  $('#result3').on('click', '#change_input', function () {
    var value = $("input[name='check']:checked").val();
    change(value, 'product');
    change(value, 'partnumber');
    change(value, 'kinds');
    change(value, 'storagelocation');
    change(value, 'quantity');
    $('#change').empty();
    table_show(xml_clone);
    wlog('製品番号 ' + value + ' に対して変更を行いました。');
  });

  function change(value, name) {
    var input_data = $("input[name='" + name + "']").val();
    if (name == 'quantity') {
      input_data = Number(input_data.replace(/,/, ''));
    }
    $(xml_clone)
      .find('stock:nth-child(' + value + ')')
      .find(name)
      .replaceWith($('<' + name + '></' + name + '>').text(input_data));
  }
  /* end:変更 */

  /* start:削除 */
  $('#result2').on('click', '#delete', function () {
    var value = $("input[name='check']:checked").val();
    $('#result3').empty();
    if (isNaN(value)) {
      wlog('エラー：製品を選択して削除ボタンを押してください。');
    } else {
      $(xml_clone)
        .find('stock:nth-child(' + value + ')')
        .remove();
      table_show(xml_clone);
      wlog('製品 ' + value + ' を削除しました。');
    }
  });
  /* end:削除 */

  /* start:保存 */
  $('#result2').on('click', '#keep', function () {
    $('#result3').empty();
    $('#result3').append(
      "<kinds for='outfile'>出力ファイル名: </kinds><br />\
      <input type='text' id='outfile' name='outfile' size='20' /><br>"
    );
    $('#result3').append("<button id='save'>保存</button>");
  });

  $('#result3').on('click', '#save', function () {
    var fname = $(":input[name='outfile']").val();
    if (!/.+\.xml/.test(fname)) {
      wlog('エラー：末尾に必ず「.xml」をつけてください。');
    } else if (/stocks.xml/.test(fname)) {
      wlog('エラー：元ファイルは上書きできません。');
    } else {
      $('#result3').empty();
      var serializer = new XMLSerializer();
      var xml_serialize = serializer.serializeToString(xml_clone);
      $.ajax({
        type: 'POST',
        url: './save.php',
        cache: false,
        datatype: 'json',
        data: {
          file_name: fname,
          file: xml_serialize,
        },
      })
        .done(function (r_data) {
          wlog('『' + fname + '』を保存しました。');
        })
        .fail(function (r_data) {
          wlog('エラー：保存に失敗しました。');
        });
    }
  });
  /* end:保存 */

  function table_show(e) {
    console.log('Table_show');
    $('#result1').empty();
    $('#result1').append('<table id="tbl" border="1">');
    $('#tbl').append(create_header());
    $(e)
      .find('stock')
      .each(function (i) {
        var product_txt = $(this).find('product').text();
        var partnumber_txt = $(this).find('partnumber').text();
        var kinds_txt = $(this).find('kinds').text();
        var storagelocation_txt = $(this).find('storagelocation').text();
        var quantity_txt = Number(
          $(this).find('quantity').text()
        ).toLocaleString();
        $('#tbl').append(
          "<tr>\
        <td><input type='radio' name='check' value=" +
            (i + 1) +
            ' /></td>\
       <td class="num">' +
            (i + 1) +
            '</td> <td>' +
            product_txt +
            '</td>\
       <td>' +
            partnumber_txt +
            '</td> <td>' +
            kinds_txt +
            '</td> <td class="label">' +
            storagelocation_txt +
            '</td> <td class="time">' +
            quantity_txt +
            '</td> </tr>'
        );
      });
  }

  function wlog(txt) {
    $('#log').empty();
    $('#log').append(txt);
  }

  /* start:ソート */
  function create_header() {
    var table_header = $('<tr></tr>');
    $(table_header).append("<th width='10px'></th>");

    var header_index = $("<th width='10px'></th>").text('');
    $(select).append(option);
    $(header_index).append(select);
    $(table_header).append(header_index);

    var header_product = $("<th width='300px'></th>").text('製品名');
    var select = $("<br/><select name='product'></select>");
    var option = $('<option value=0></option>').text('並び替え');
    $(select).append(option);
    var option = $('<option value=1></option>').text('▲');
    $(select).append(option);
    var option = $('<option value=2></option>').text('▼');
    $(select).append(option);
    $(header_product).append(select);
    $(table_header).append(header_product);

    var header_partnumber = $("<th width='200px'></th>").text('品番');
    var select = $("<br/><select name='partnumber'></select>");
    var option = $('<option value=0></option>').text('並び替え');
    $(select).append(option);
    var option = $('<option value=1></option>').text('▲');
    $(select).append(option);
    var option = $('<option value=2></option>').text('▼');
    $(select).append(option);
    $(header_partnumber).append(select);
    $(table_header).append(header_partnumber);

    var header_kinds = $("<th width='200px'></th>").text('種別');
    var select = $("<br/><select name='kinds'></select>");
    var option = $('<option value=0></option>').text('並び替え');
    $(select).append(option);
    var option = $('<option value=1></option>').text('▲');
    $(select).append(option);
    var option = $('<option value=2></option>').text('▼');
    $(select).append(option);
    $(header_kinds).append(select);
    $(table_header).append(header_kinds);

    var header_storagelocation = $("<th width='200px'></th>").text('保管場所');
    var select = $("<br/><select name='storagelocation'></select>");
    var option = $('<option value=0></option>').text('並び替え');
    $(select).append(option);
    var option = $('<option value=1></option>').text('▲');
    $(select).append(option);
    var option = $('<option value=2></option>').text('▼');
    $(select).append(option);
    $(header_storagelocation).append(select);
    $(table_header).append(header_storagelocation);

    /* 個数のセル */
    var header_quantity = $("<th width='200px'></th>").text('個数');
    var select = $("<br/><select name='quantity'></select>");
    var option = $('<option value=0></option>').text('並び替え');
    $(select).append(option);
    var option = $('<option value=1></option>').text('▲');
    $(select).append(option);
    var option = $('<option value=2></option>').text('▼');
    $(select).append(option);
    $(header_quantity).append(select);
    $(table_header).append(header_quantity);
    return table_header;
  }

  function sort_table_show(arr) {
    console.log('Table_show');
    $('#result1').empty();
    $('#result1').append('<table id="tbl" border="1">');
    $('#tbl').append(create_header());

    var stock = $(xml_clone).find('stock');
    for (var i = 0; i < arr.length; i++) {
      var idx = arr[i].idx;
      var product_txt = $(stock[idx]).find('product').text();
      var partnumber_txt = $(stock[idx]).find('partnumber').text();
      var kinds_txt = $(stock[idx]).find('kinds').text();
      var storagelocation_txt = $(stock[idx]).find('storagelocation').text();
      var quantity_txt = Number(
        $(stock[idx]).find('quantity').text()
      ).toLocaleString();
      $('#tbl').append(
        "<tr>\
        <td width='20px'><input type='radio' name='check' value=" +
          (i + 1) +
          ' /></td>\
        <td class="num">' +
          (i + 1) +
          '</td>\
        <td>' +
          product_txt +
          '</td>\
        <td>' +
          partnumber_txt +
          '</td> <td>' +
          kinds_txt +
          '</td> <td class="storagelocation">' +
          storagelocation_txt +
          '</td> <td class="quantity">' +
          quantity_txt +
          '</td> </tr>'
      );
    }
  }

  $('#result1').on('change', 'select', function () {
    var att = $(this).attr('name');
    var val = $(this).val();
    var stocks = $(xml_clone).find('stocks');
    var select_arr = create_arr(stocks, att);
    var sort_arr = sort_stocks(att, val, select_arr);
    sort_table_show(sort_arr);
  });

  function create_arr(stocks, att) {
    var arr = [];
    stocks.find('stock').each(function (i) {
      arr.push({ idx: i, key: $(this).find(att).text() });
    });
    return arr;
  }

  function sort_stocks(att, val, select_arr) {
    var sort_arr;

    if (att == 'quantity') {
      return (sort_arr = sort_num(val, select_arr));
    }
    return (sort_arr = sort_str(val, select_arr));
  }

  function sort_num(val, arr) {
    if (val == 1) {
      arr.sort(function (a, b) {
        return a.key - b.key;
      });
      return arr;
    }
    arr.sort(function (a, b) {
      return b.key - a.key;
    });
    return arr;
  }

  function sort_str(val, arr) {
    if (val == 1) {
      arr.sort(function (a, b) {
        if (a.key < b.key) {
          return -1;
        }
        return 1;
      });
      return arr;
    }
    arr.sort(function (a, b) {
      if (a.key < b.key) {
        return 1;
      }
      return -1;
    });
    return arr;
  }
  /* end:ソート */

  /* start:検索 */
  $('#result2').on('click', '#search', function () {
    $('#result3').empty();
    var p = $('<p></p>').text('検索項目');
    $('#result3').append(p);

    // 検索項目の選択
    var select = $("<select name='search_select'></select>");
    var option = $("<option value='product' selected></option>").text('製品名');
    $(select).append(option);
    var option = $("<option value='storagelocation'></option>").text(
      '保管場所'
    );
    $(select).append(option);
    var option = $("<option value='partnumber'></option>").text('品番');
    $(select).append(option);
    var option = $("<option value='kinds'></option>").text('種別');
    $(select).append(option);
    var option = $("<option value='quantity'></option>").text('個数');
    $(select).append(option);
    $('#result3').append(select);

    // 検索文字列の入力フィールド
    $('#result3').append(
      "<input type='text' name='search_input' size='50px' /><br>"
    );

    // 個数検索時の以上/等しい/以下の選択
    $('#result3').append("<kinds for='select_quantity'>個数検索時</kinds>");
    var select = $("<select name='select_quantity'></select>");
    var option = $("<option value='upper' selected></option>").text('以上');
    $(select).append(option);
    var option = $("<option value='equal'></option>").text('等しい');
    $(select).append(option);
    var option = $("<option value='lower'></option>").text('以下');
    $(select).append(option);
    $('#result3').append(select);

    var search_button = $("<br><button id='search_button'></button>").text(
      '検索実行'
    );
    $('#result3').append(search_button);
  });

  // 検索実行
  $('#result3').on('click', '#search_button', function () {
    var item = $("select[name='search_select']").val();
    var val = $(":input[name='search_input']").val();
    var val2 = $("select[name='select_quantity']").val();
    console.log(item + ' ' + val + ' ' + val2);

    //オリジナルのXMLのデータをコピーして加工する
    search_xml = xml_clone.cloneNode(true);
    console.log('clone通過');

    // search_xmlの方は、stocksを消して、ガワだけにする。あとで、xml_cloneから抽出した本だけを書き込む
    var stocks = $(search_xml).find('stocks');
    $(stocks).empty();

    // 文字列の一致しか見ない検索
    // 個数の比較(以上/等しい/以下)を行うためのコードを追加する必要がある
    $(xml_clone)
      .find('stock')
      .each(function (i) {
        $(this)
          .find(item)
          .each(function () {
            if (item == 'quantity') {
              val = parseInt(val);
              var num = Number($(this).text().replace(/,/, ''));
              if (val2 == 'upper') {
                if (val <= num) {
                  var stock = $(this).parent().clone();
                  $(stocks).append(stock);
                  console.log('upper ' + num);
                }
              } else if (val2 == 'equal') {
                if (val == num) {
                  var stock = $(this).parent().clone();
                  $(stocks).append(stock);
                  console.log('equal ' + num);
                }
              } else {
                if (val >= num) {
                  var stock = $(this).parent().clone();
                  $(stocks).append(stock);
                  console.log('lower ' + num);
                }
              }
            } else {
              if (val == $(this).text()) {
                var stock = $(this).parent().clone();
                $(stocks).append(stock);
                console.log($(this).text());
              }
            }
          });
      });

    table_show(search_xml);
  });
  /* end:検索 */
});
