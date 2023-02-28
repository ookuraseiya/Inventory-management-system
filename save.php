<?php
   $file_name = $_POST['file_name'];
   $xml = $_POST['file'];

   $fp = fopen($file_name,"w");
   fwrite($fp,$xml);
   fclose($fp);

   echo ($file_name." に保存しました");
?>
