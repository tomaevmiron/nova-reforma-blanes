# Servidor estático mínimo para previsualizar la web en local
$raiz = Split-Path $PSScriptRoot -Parent
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add('http://localhost:8137/')
$l.Start()
Write-Output "Sirviendo $raiz en http://localhost:8137/"
$tipos = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css'; '.js'='text/javascript'; '.svg'='image/svg+xml'; '.jpg'='image/jpeg'; '.png'='image/png' }
while ($l.IsListening) {
  $c = $l.GetContext()
  $ruta = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath).TrimStart('/')
  if ($ruta -eq '') { $ruta = 'index.html' }
  $f = Join-Path $raiz $ruta
  if ((Test-Path $f -PathType Leaf) -and ((Resolve-Path $f).Path.StartsWith($raiz))) {
    $b = [IO.File]::ReadAllBytes($f)
    $ext = [IO.Path]::GetExtension($f).ToLower()
    if ($tipos.ContainsKey($ext)) { $c.Response.ContentType = $tipos[$ext] }
    $c.Response.Headers.Add('Cache-Control','no-store')
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
