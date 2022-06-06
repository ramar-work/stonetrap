<link rel="stylesheet" href="/assets/css/zero.css">
<link rel="stylesheet" href="/assets/css/select.css">

<ul class="select">
{{ #L }}
	<a href="{{ .levelhref }}">
		<li>
			<img src="{{ .hintimage }}"></img>
			<div>
			</div>
		</li>	
	</a>
{{ /L }}
</ul>
