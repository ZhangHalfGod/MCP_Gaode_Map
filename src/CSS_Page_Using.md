<!-- 引入 layui.css -->
<link href="//unpkg.com/layui@2.11.5/dist/css/layui.css" rel="stylesheet">

<!-- 引入 layui.js -->
<script src="//unpkg.com/layui@2.11.5/dist/layui.js"></script>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Quick Start - Layui</title>
  <link href="//unpkg.com/layui@2.11.5/dist/css/layui.css" rel="stylesheet">
</head>
<body>
  <!-- HTML Content -->
  <script src="//unpkg.com/layui@2.11.5/dist/layui.js"></script>
  <script>
  // Usage
  layui.use(function(){
    var layer = layui.layer;
    // Welcome
    layer.msg('Hello World', {icon: 6});
  });
  </script>
</body>
</html>