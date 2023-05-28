function locales(string, langcode){

	var arr = [];
	if(langcode == 'pt-BR'){
		arr['HELLOMSG'] = 'Olá';
		arr['SURE_TO_CANCEL'] = 'Tem certeza que deseja cancelar?';
		arr['WAIT'] = 'Aguarde..';
		arr['CONTACT_PAGE_TEXT'] = 'Texto aqui';
	}
	else if(langcode == 'en'){
		arr['HELLOMSG'] = 'Hello';
		arr['SURE_TO_CANCEL'] = 'Are you sure you want to cancel?';
		arr['WAIT'] = 'Wait...';
		arr['CONTACT_PAGE_TEXT'] = 'Text here';

	}
	
	return arr[string];

}



//console.log(locales('HELLOMSG', 'pt-BR'));