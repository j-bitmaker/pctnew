<template>
<div id="contacts">

	<div class="controlPanel mobp" v-if="includeAdd">
		<button class="button small" @click="newclient">Add client</button>
	</div>

	<div class="controls mobp">
		<listcontrols @filtering="filtering" :filters="filters" :filterValues="filterValues" :dfilterValues="dfilterValues" :searchvalue="searchvalue" :count="count" :sortvalue="sort" :sorting="sorting" @search="search" @sort="sortchange" :store="type || 'contacts'"/>
	</div>

	<div class="added mobp" v-if="added">
		<button class="button" @click="reload">You have a new {{label}} ({{added}})</button>
	</div>
	
	<listpaginated :placeholder="'No ' +label+ 'found'" :activity="type" :select="{...select, ...{context : label}}" api="crm.contacts.list" :payload="payload" :start="1" ref="list" @count="setcount">
		<template v-slot:default="slotProps">
			<div class="cardWrapper mobp">
				<contact :hasmenu="hasmenu" :profile="slotProps.item" @open="open"  @deletecontact="deleteContactFromList" @portfoliosChanged="p => {portfoliosChanged(slotProps.item, p)}"/>
			</div>
		</template>
	   
	</listpaginated>

	<selection :context="label" :selectall="select && select.selectall" :menu="menu" @selectall="selectall" @success="selected" @cancel="cancel"/>


</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
