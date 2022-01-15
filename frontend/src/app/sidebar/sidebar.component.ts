import { Component, OnInit, ɵConsole } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
	selector: "app-sidebar",
	templateUrl: "./sidebar.component.html",
	styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
	user_name = "";
	user_image = "";
	user_created_at: "";
	user_access_role;
	user_email;
	user_contact_number;
	user_type = "";
	user_id: any;
	dashboard_url: string = null;
	dashboard = false;
	configuration = false;
	reports = false;
	device = false;
	activeRouteName;
	activeRouteCss;
	buildMode: string = environment.buildMode;

	constructor(private activeroute: ActivatedRoute, private router: Router) {

		let Dashboard = [
			"/dashboard","/task-details","/axb-update","/product-details","/dashboarda2a","/axb-update","/archive-task","/audit/log"
		];

		let act_url = this.router.routerState.snapshot.url;
		let paramIndex = act_url.indexOf('?');
		if(paramIndex > -1){
			act_url = act_url.substring(0,(paramIndex));
		}

		if (Dashboard.indexOf(act_url) > -1) {
			this.dashboard = true;
		}

		let Configuration = [
			"/create-ordera2a","/gis",
			"/employee/list","/employee/save","/acl-management",
			"/warehouse/list","/warehouse/save",
			"/customer/list","/customer/rate","/employee/save","/customer/save","/customer/create-task","/customer/branches","/customer/save-branch","/customer/shipper","/customer/save-shipper",
			"/truck/list","/truck-save",
			"/flights","/flight/save", "/products","/add-product",
			"/pincode","/test/duplicate-route","/customer-dashboard","/add-branch","/new-task","/freighter/list","/freighter/save",
			"/download-pod","/upload-pod"
		];

		let act_ur = this.router.routerState.snapshot.url;

		paramIndex = act_ur.indexOf('?');
		if(paramIndex > -1){
			act_ur = act_ur.substring(0,(paramIndex));
		}

		if (Configuration.indexOf(act_ur) > -1) {
			this.configuration = true;
		}
		this.isReportRoute();

		let Device = [
			"/device/list",
			"/device/save"
		];

		let act_u = this.router.routerState.snapshot.url;
		
		paramIndex = act_ur.indexOf('?');
		if(paramIndex > -1){
			act_u = act_ur.substring(0,(paramIndex));
		}

		if (Device.indexOf(act_ur) > -1) {
			this.device = true;

		}


	}

	ngOnInit() {
		// alert("test2");
		this.activeRouteName = "";
		this.activeRouteCss = "";
		this.selectSideOption(this.router.url);

		const userData = JSON.parse(localStorage.getItem("userData"));
		if (userData != null) {
			this.user_id = userData.id;
			this.user_name = userData.hasOwnProperty("name") ? userData.name : "Guest";
			this.user_image = userData["user_image"];
			this.user_email = userData["email"];
			this.user_contact_number = userData["contact_number"];
			this.user_type = userData['type'];

			if (this.user_access_role == 2 && this.user_type == 'A2A') {
				this.dashboard_url = '/dashboarda2a';
			} else if (this.user_access_role == 3) {
				this.dashboard_url = '/dashboard';
			}
		}

	}


	/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
	manageConfView(key) {
	  	this[key] = !this[key];
	}



	selectSideOption(routeName) {
		// alert(routeName)
		// if(routeName=='/dashboard' || routeName=='/'){
		//   this.activeRouteName = 'dashboard';
		// }else if(routeName=='/agent-details'){
		//   this.activeRouteName = 'agent-details';
		//   this.activeRouteCss = routeName;
		// }
	}

	isReportRoute(){
		let reports = [
			"/offload-task",
			"/tonnage"
		];

		let act_url = this.router.routerState.snapshot.url;
		let paramIndex = act_url.indexOf('?');

		paramIndex = act_url.indexOf('?');
		if(paramIndex > -1){
			act_url = act_url.substring(0,(paramIndex));
		}

		if (reports.indexOf(act_url) > -1) {
			this.reports = true;
		}
	}

}
