<?php

//Make sure all required fields are given
if (!isset($_POST['score']) || !isset($_POST['name'])){
	http_response_code(406);
	exit;
}

//Make sure we have a valid score
$score = intval($_POST['score']);
if ($score<=0){
	http_response_code(406);
	exit;
}

//Make sure we have a valid name
$name = $_POST['name'];
if (!preg_match("/^[a-zA-Z0-9-_ ]*$/", $name) && $name!=''){
	http_response_code(406);
	exit;
}

$json = json_decode(file_get_contents('assets/data/leaderboard.json'));
$count = count($json);

if ($count===0){
	$json[0] = array('n'=>$name, 's'=>$score);
}
for ($i=0;$i<$count;$i++){
	if ($json[$i]->{'s'}<$score){
		array_splice($json, $i, 0, array(
			array('n'=>$name, 's'=>$score)
		));
		break;
	}
}

file_put_contents('assets/data/leaderboard.json', json_encode($json));
http_response_code(200);

?>