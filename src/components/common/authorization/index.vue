<template>
<div id="authorization">

	<div class="caption section">
		{{ $t("caption.signin") }}
	</div>

	<div class="sitelogin section">
		<div class="form">
			<div class="item">
				<div class="label">
					<div class="work">
						<label for="iemail">
							<span>{{ $t("common.enteremail") }}</span>
						</label>
					</div>
				</div>
				<div class="input">
					<input type="email" @focus="focusedLogin" autocomplete="on" @change="changelogin" @keyup="keyuplogin" :value="login" name="email" />
				</div>
			</div>
			<div class="item">
				<div class="label">
					<div class="work">
						<label for="ipassword"><span>{{ $t("common.29010112") }}</span></label>
					</div>
				</div>
				<div class="input">
					<input @keyup.enter="signin" id="ipassword" type="password" :value="password" @input="password = $event.target.value" name="password" autocomplete="on" />
				</div>
				<div class="label forgotPassword">
					<router-link to="forgotpassword">
						<div class="work">
							<span>{{ $t("common.2901098") }}</span>
						</div>
					</router-link>
				</div>
			</div>

			<div class="work">
				<div class="item buttons">
					<button class="enter button" v-on:click="signin">
						{{ $t("common.2901008") }}
					</button>

				</div>

				
			</div>
		</div>
	</div>

	<div class="caption section">
		{{ $t("caption.haventaccount") }}
	</div>

	<div class="newaccount section">
		<div class="item buttons">
			<button class="enter button black" v-on:click="registration">
				Register and start trial
			</button>
			<button class="enter button ghost" v-on:click="demo">
				Request demo
			</button>
		</div>
	</div>

	<div class="help section">
		<router-link to="/faq">
			<span>{{$t('caption.helpfooter')}}</span>
		</router-link>
	</div>

	<transition name="fade">
		<preloader v-if="auth == 2 || loading" />
	</transition>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
