<script>
	// import logoIcon from '$img/logo-white.png';
	// import github from '$lib/assets/github.svg';
	// import youtube from '$lib/assets/youtube.svg';
	// import facebook from '$lib/assets/facebook.svg';
	// import twitter from '$lib/assets/twitter.svg';
	import { WEBSITE_NAME } from '$lib/constant';
</script>

<footer>
	<div class="page-size footer-_-3">
		<div class="flex a-asdfasa">
			<section>
				<div class="flex left-x3x">
					<h2>{WEBSITE_NAME.toUpperCase()}</h2>
					<span class="fz12">WE ARE READY FOR THE FUTURE!</span>
					<span class="c824c"
						>Stay ahead of the curve and know before you buy with {WEBSITE_NAME}.</span
					>
					<div class="c824c">
						<p>
							Copyright &copy; {new Date().getFullYear()}. {WEBSITE_NAME} Services
						</p>
						<p>
							<a href="/privacy-policy" title="privacy policy">Privacy Policy</a>
							| <a href="/sitemap" title="privacy policy">Site Map</a>
						</p>
					</div>
				</div>
			</section>
			<section>
				<div class="dfc-c ai-s links">
					<span>COMPANY</span>
					<a href="/about">About</a>
					<a href="https://www.youtube.com/channel/UCMJTfB8cZLxjvUht3o0E3qQ" rel="noopener"
						>Blueterminal</a
					>
					<a href="/contact">Contact us</a>
				</div>
			</section>
			<section>
				<div class="dfc-c ai-s links">
					<span>PRODUCTS</span>
					<a href="/smart-phones">Smart Phones</a>
					<a href="/computers">Desktop & Laptops Pc</a>
					<a href="/firmwares">Mobile Firmwares</a>
				</div>
			</section>
			<section>
				<div class="dfc-c ai-s links">
					<span>FIND OUT</span>
					<a href="/blogs" title="blogs page">Blogs</a>
					<a href="/search" title="Search page">Search</a>
					<a href="/sign-in" title="sign in page">Sign in</a>
					<a href="/cart" title="your cart">Home</a>
				</div>
			</section>
			<section>
				<div class="dfc-c ai-s links">
					<span>AIM</span>
					<p>
						What is your need? Is it suitable for you? Are you buying the correct thing? Is this
						something you will use in your future? Answering these questions is crucial if you want
						to make a wise purchase and become a responsible consumer. therefore stay with us.
					</p>
				</div>
			</section>
		</div>
	</div>
</footer>

<style lang="scss">
	footer {
		background: var(--secondary-bg);
		color: var(--primary-color);
		padding: 30px 10px;
		z-index: 1;
		position: relative;
		& .footer-_-3 {
			margin: auto;
			max-width: 80%;
		}
		& .a-asdfasa {
			align-items: flex-start;
		}
		& .left-x3x {
			flex-direction: column;
			justify-content: center;
			min-width: 208px;
			text-align: center;
			& h2 {
				margin: 5px 0;
			}
			& img {
				width: 160px;
			}
			& .c824c {
				font-size: 12px;
				margin-top: 20px;
				& img {
					width: 32px;
					margin-right: 20px;
				}
				& p {
					margin-top: 7px;
					& a {
						margin-right: 10px;
						text-decoration: underline;
						&:hover {
							color: var(--secondary-color);
						}
					}
				}
			}
		}
		& section {
			margin: 10px 23px;
			max-width: 300px;
			& .links {
				min-width: 157px;
				display: flex;
				flex-direction: column;
				& span {
					margin-bottom: 10px;
					font-size: 15px;
				}

				& a {
					margin-top: 12px;
					font-size: 12px;
					&:hover {
						color: var(--secondary-color);
					}
				}
			}
			& p {
				font-size: 12px;
			}
		}
	}
</style>
