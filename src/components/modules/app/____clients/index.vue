<template>
<div id="leads">
	<div class="controls mobp">
		<listcontrols :searchvalue="searchvalue" :count="count" :sortvalue="sort" :sorting="sorting" @search="search" @sort="sortchange" />
	</div>

	<div class="added mobp" v-if="added">
		<button class="button" @click="reload">You have a new clients ({{added}})</button>
	</div>
	
	<listpaginated placeholder="No clients found" activity="client" :select="{...select, ...{context : 'client'}}" api="crm.contacts.list" :payload="payload" :start="1" ref="list" @count="setcount">
		<template v-slot:default="slotProps">
			<div class="cardWrapper mobp">
				<client :hasmenu="hasmenu" :profile="slotProps.item" @open="open"  @deleteclient="deleteclient" @portfoliosChanged="p => {portfoliosChanged(slotProps.item, p)}"/>
			</div>
		</template>
	   
	</listpaginated>

	<selection context="client" :selectall="select && select.selectall" :menu="menu" @success="selected" @cancel="cancel"/>


</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
