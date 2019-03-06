<template>
    <div class="newUser">
        <div class="nav">
            <div class="inWidth">
                <img class="fl" src="../../assets/images/logo@2x.png" width="98px" alt="">
                <!--<div class="toggle fr">-->
                <!--<select name="yuyan" id="yuyan">-->
                <!--<option value="简体中文">简体中文</option>-->
                <!--<option value="English">English</option>-->
                <!--</select>-->
                <!--</div>-->
            </div>
        </div>
        <div class="container">
            <div v-if="show">
                <div class="box">
                    <p class="title">新用户注册激活</p>
                </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px"
                         class="demo-ruleForm"
                         label-position="right">
                    <el-form-item label="用户名">
                        <span><b>{{username}}</b></span>
                    </el-form-item>
                    <div class="formBox">
                        <el-form-item class="clearfix" label="设置登录信息">
                            <span>登录时需验证，保护账户信息</span>
                        </el-form-item>
                        <el-form-item label="管理员名称" prop="loginName">
                            <el-input clearable v-model="ruleForm.loginName"></el-input>
                            <div class="tag">为5-25位字符，字母或者字母加数字<i></i></div>
                        </el-form-item>
                        <el-form-item label="登录密码" prop="loginPassword">
                            <el-input clearable v-model="ruleForm.loginPassword" type="password"></el-input>
                            <div class="tag">
                                <div class="qiangdu">
                                    安全强度
                                    <p v-show="pwdStrength==''" class="wu"><span></span><span></span><span></span></p>
                                    <p v-show="pwdStrength=='di'" class="di"><span
                                            class="color"></span><span></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;低
                                    </p>
                                    <p v-show="pwdStrength=='zhong'" class="zhong"><span class="color"></span><span
                                            class="color"></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;中</p>
                                    <p v-show="pwdStrength=='gao'" class="gao"><span class="color"></span><span
                                            class="color"></span><span class="color"></span>&nbsp;&nbsp;&nbsp;&nbsp;高
                                    </p>
                                </div>
                                <div>•请输入6~20字符，只能包含字母、数字、以及标点符号(除空格)，字母、数字、符号至少包含2种，字母区分大小写</div>
                                <i></i>
                            </div>
                        </el-form-item>
                        <el-form-item label="确认登录密码" prop="loginPasswordConfirm">
                            <el-input clearable v-model="ruleForm.loginPasswordConfirm" type="password"></el-input>
                        </el-form-item>
                    </div>
                    <div class="formBox">
                        <el-form-item class="clearfix" label="设置支付密码">
                            <span>交易付款或账户信息更改时需输入</span>
                        </el-form-item>
                        <el-form-item label="支付密码" prop="payPassword">
                            <el-input clearable v-model="ruleForm.payPassword" type="password"></el-input>
                            <div class="tag">
                                <div class="qiangdu">
                                    安全强度
                                    <p v-show="pwdStrength2==''" class="wu"><span></span><span></span><span></span></p>
                                    <p v-show="pwdStrength2=='di'" class="di"><span
                                            class="color"></span><span></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;低
                                    </p>
                                    <p v-show="pwdStrength2=='zhong'" class="zhong"><span class="color"></span><span
                                            class="color"></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;中</p>
                                    <p v-show="pwdStrength2=='gao'" class="gao"><span class="color"></span><span
                                            class="color"></span><span class="color"></span>&nbsp;&nbsp;&nbsp;&nbsp;高
                                    </p>
                                </div>
                                <div>•请输入6~20字符，只能包含字母、数字、以及标点符号(除空格)，字母、数字、符号至少包含2种，字母区分大小写</div>
                                <i></i>
                            </div>
                        </el-form-item>
                        <el-form-item label="确认支付密码" prop="payPasswordConfirm">
                            <el-input clearable v-model="ruleForm.payPasswordConfirm" type="password"></el-input>
                        </el-form-item>
                    </div>
                    <div class="formBox">
                        <el-form-item class="clearfix" label="设置安全保护">
                            <span>为了给你提供更好的支付和金融服务提高支付安全，请设置问题保护</span>
                        </el-form-item>
                        <el-form-item label="选择安全保护问题" prop="securityQuestion">
                            <el-select v-model="ruleForm.securityQuestion" placeholder="请选择选择安全保护问题"
                                       style="width:310px;">
                                <el-option v-for="(item,index) in questionArr" :key="index" :label="item.questionZH"
                                           :value="item.id"></el-option>
                                <!--<el-option label="区域二" value="beijing"></el-option>-->
                            </el-select>
                        </el-form-item>
                        <el-form-item label="您的回答" prop="securityAnswer">
                            <el-input clearable v-model="ruleForm.securityAnswer"></el-input>
                        </el-form-item>
                        <el-form-item label="设置问候语" prop="greeting">
                            <el-input clearable v-model="ruleForm.greeting"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="verifyCode">
                            <el-input clearable style="width: 200px" v-model="ruleForm.verifyCode"></el-input>
                            <img style="vertical-align: middle;" :src="piccode" alt="" @click="getCode">
                            <p><span class="tishi">请填写图片中的字符，不区分大小写</span><span class="getImg"
                                                                                @click="getCode">看不清？ 换张图片</span></p>
                        </el-form-item>
                        <el-form-item label="" prop="checked">
                            <!--<el-input clearable v-model="ruleForm.greeting"></el-input>-->
                            <!--<el-checkbox v-model="ruleForm.checked">我已阅读并同意</el-checkbox>-->
                            <el-checkbox-group v-model="ruleForm.checked">
                                <el-checkbox label="我已阅读并同意" name="type"></el-checkbox>
                                <el-button type="text" style="margin-left: 20px" @click="showWord=true;show=false">
                                    iPayLinks服务协议
                                </el-button>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="submitForm('ruleForm',success,error)">立即激活
                            </el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div v-else>
                <div v-if="showWord==false" class="timeout">
                    <p><span class="el-icon-error" style='color: #c2402e;font-size: 72px;margin: 86px 0 24px'></span>
                    </p>
                    <p class="resultSuc">您的激活码无效，请联系客服</p>
                </div>
            </div>
            <div v-if="showWord">
                <div class="box">
                    <p class="title">iPayLinks服务协议</p>
                    <p class="title1">启贇金融信息服务（上海）有限公司</p>
                    <p>
                        （以下简称iPay）作为国际信用卡网络支付服务提供商，同意为贵公司提供国际信用卡网络支付结算及相关服务。贵公司作为网络应用或者服务提供商，同意在其业务中使用iPay所提供的支付服务。现经双方协商一致，根据相关法律法规，就具体合作事宜达成如下协议。国际信用卡支付服务协议</p>
                    <p class="title1"> 一、 服务内容</p>
                    <p>
                        1.网络支付服务及结算服务：为贵公司的商务网站提供进行交易的网络在线支付结算及退款功能，通过和启赟金融信息服务（上海）有限公司平台实现网上支付系统与银行交换信息，并将银行的确认信息反馈贵公司；iPay以自身拥有的服务通道向贵公司提供服务，并根据iPay的业务发展进行调整。</p>
                    <p>
                        2.国际信用卡组织的注册客户：贵公司在成为iPay商户的同时成为国际信用卡组织注册客户，按国际信用卡组织规定享有国际信用卡客户的权利，同时接受国际信用卡组织对其注册客户的交易监管。国际信用卡组织发现其注册客户的拒付交易构成风险时，有权暂停其注册客户的交易通道。</p>
                    <p> 3.系统接入、管理服务：iPay为贵公司提供订单信息传输的接口规范、商户后台管理权限设定等；</p>
                    <p> 4.网上支付服务：iPay为贵公司提供其商务网站进行交易所需要的在线支付。</p>
                    <p> 5.在线服务：iPay为贵公司设立网上支付查询功能，为贵公司提供商户信息管理和交易信息查询服务。</p>
                    <p class="title1"> 二、 iPay账户注册义务</p>
                    <p> 1.“iPay账户”：指在贵公司使用本服务时，本公司向贵公司提供的具有唯一编号的账户。贵公司可自行设置密码，并用以查询或计量贵公司的预付、应收或应付款。</p>
                    <p>
                        2.在使用本服务前，贵公司必须先行注册，取得本公司提供给贵公司的“iPay账户”（以下简称该账户），且保证在贵公司同意接受本协议并注册成为iPay的用户时，贵公司是具有法律规定的完全民事权利能力和民事行为能力、能够独立承担民事责任的自然人、法人或其他组织；本协议内容不受贵公司所属国家或地区的排斥。不具备前述条件的，贵公司应立即终止注册或停止使用本服务。</p>
                    <p>
                        3.贵公司同意遵守所有与本服务相关之国内国际法律及规定，依本服务注册表之提示提供贵公司正确、最新及完整的资料（以下称“登记资料”）；贵公司保证不在任何情况下冒用或盗用他人的身份进行注册或者干扰他人使用本服务。</p>
                    <p>
                        4.贵公司有义务维护并及时更新贵公司的「登记资料」，确保其为正确、最新及完整。若贵公司提供任何错误、不实、过时或不完整的资料，或者本公司有合理的理由怀疑贵公司的「登记资料」为错误、不实、过时或不完整，本公司有权暂停或终止贵公司的用户账户，并拒绝贵公司现在和未来使用本服务之部份或全部，贵公司并同意负担因此所产生的直接或间接的任何损失、支出、费用、罚金。因贵公司未及时更新资料，导致本服务无法提供或提供时发生任何错误，贵公司不得将此作为取消交易、拒绝付款的理由，贵公司将承担因此产生的一切后果，本公司不承担任何责任。</p>
                    <p>
                        5.贵公司的用户基本资料（包括且不限于姓名、电子邮件地址、手机号码、金融账户等一切必要信息，即注册表中标注“*”符号的栏位信息）为使用本服务的必需资料，如有变更请立即修正。若因用户未及时更新基本资料，导致有关流程和操作（包括但不限于后续资金流、资讯流等作业）无法完成或发生错误，由此产生的一切后果和责任由用户承担；用户并不得以此作为取消交易、拒绝付款或采取其他不当行为之理由。</p>
                    <p>
                        6.贵公司将对使用该账户及密码进行的一切操作及言论负完全的责任，只有贵公司授权操作员可以使用贵公司的iPay账户，该账户不可转让、不可赠与、不可继承。在贵公司决定不再使用该账户时，贵公司应将该账户下所对应的可用款项全部提现或者向本公司发出其它支付指令，并向本公司申请注销（永久冻结）该账户。</p>
                    <p> 7. 贵公司同意，若贵公司丧失全部或部分民事权利能力或民事行为能力，本公司有权根据有效法律文书（包括但不限于生效的法院判决、生效的遗嘱等）处置与贵公司的iPay账户相关的款项。</p>
                    <p>
                        8.贵公司应确保贵公司的用户账户和密码仅由贵公司授权操作员亲自使用。本公司通过贵公司的用户名和密码识别贵公司的指示，一切通过密码进行的行为均视为贵公司授权行为。贵公司不可向其他任何人泄露、透露、告知贵公司的用户账户和密码，亦不可使用其他任何人的用户账户和密码。使用他人用户账户和密码者与该用户账户和密码的实际注册人应承担与交易相关的所有法律责任。由于贵公司的原因导致贵公司的用户账户和/或密码被其他任何人知悉，造成贵公司的用户账户和/或密码被他人使用导致贵公司损失的，本公司不承担任何责任。</p>
                    <p>
                        9.如贵公司发现有他人冒用或盗用贵公司的账户及密码或任何其他未经合法授权之情形时，应立即以有效方式通知本公司，要求本公司暂停相关服务。同时，贵公司理解本公司对贵公司的请求采取行动需要合理期限，本公司于接受通知前（该等通知应不存在任何迟延情形），对第三人使用本服务已发生之效力和后果，除非可证明本公司对未经合法授权之使用的形成存在故意或重大过失，否则本公司将不承担任何责任。若贵公司迟延通知，则迟延期间产生的损失，本公司将不需承担任何责任。</p>
                    <p>
                        10.贵公司同意，基于运行和交易安全的需要，本公司基于自身之独立判断，有权于发现异常交易或怀疑为异常或违法之交易时，不经通知先行暂停或终止贵公司的用户账户，并拒绝贵公司使用本服务之部份或全部、或提供新的功能。但是，判断和发现异常交易或怀疑为异常或违法之交易，并不构成本公司的一项义务和责任。</p>
                    <p class="title1"> 三、 贵公司权利和义务</p>
                    <p>
                        1.贵公司有权通过iPay网站或者iPay提供的服务电话咨询支付相关流程及资费标准，贵公司可以就iPay提供的支付平台、结算系统等相关服务事项提出咨询，iPay在业务允许范围内应当及时解答。</p>
                    <p> 2.贵公司有权根据协议的约定查询、下载、存档交易数据，并负责对该数据进行保密。</p>
                    <p>
                        3.贵公司有权根据协议的约定进行商户注册，贵公司应妥善保管注册的商户账号，并对上述信息保密及妥善管理，因贵公司未妥善保管注册商户名称、密码及相关数据照成信息泄露及损失的，应当自行承担损害及赔偿责任。</p>
                    <p>
                        4.贵公司应当依照法律、法规、国际卡组织的规定以及iPay准入商户的要求合法发布信息、诚信经营，不得以非法经营、不正当竞争、虚假宣传、非法广告、商业欺诈等方式侵害消费者及用户的合法权益，贵公司独立承担因其网站信息虚假、陈旧、不详实或者侵犯知识产权引起的退货、投诉及赔偿责任，贵公司因上述行为给iPay造成包括但不限于声誉、形象及经济等不良损失的，应当承担赔偿责任。</p>
                    <p>
                        5.贵公司应当向iPay如实提供基本信息、商户准入资质材料及相关法律证明，并全面陈述其经营范围，贵公司在上述资料及注册信息、注册邮箱、结算信息等重要信息发生变更时，应至少提前3个工作日以加盖公章的书面形式通知iPay，并按照iPay的要求提供相应的资质材料；上述资料提供不完整或者变更未及时通知的，贵公司独立承担因此引起的不利后果，因此对iPay造成损害的，iPay有权向贵公司索取赔偿。iPay对iPay网站的内容、标示及程序拥有绝对的知识产权及所有权，在未得到iPay书面授权情况下，贵公司不得擅自转载、复制、截取、再造iPay网站上内容，或者创造与iPay网站内容有关的衍生产品。</p>
                    <p>
                        6.贵公司使用iPay提供的支付平台管理系统，按照iPay支付平台的结算流程制定相应的订单处理、发货或提供服务的程序。贵公司货运实物给客户的，应当要求客户收到货物后在收货单上签字确认，并妥善保留相关交易信息，相关凭证信息应保留至少五年。根据iPay的监控需要，要求贵公司提供上述材料的，贵公司应在接到iPay通知之日起3个工作日内提交通知要求的全部交易凭证及相关证据材料，贵公司对此项调查要求及材料提交要求不得抗辩或者拒绝。</p>
                    <p> 7. 贵公司将把iPay作为电子支付服务提供方，不得无正当理由拒绝客户使用iPay电子支付服务而产生的成功交易，如贵公司违反本规定，iPay有权据此终止本协议并追究违约责任。</p>
                    <p>
                        8.非经iPay书面允许，贵公司不得将电子支付服务用于本协议约定网站之外的其他网站或用于约定业务之外的其他业务，不得将电子支付服务/设备直接或变相延伸至贵公司之外的任何第三方使用。如贵公司违反本规定，iPay有权立即停止向贵公司提供服务、冻结贵公司的交易款项、处以罚金，并且贵公司应当赔偿由此造成的全部损失。</p>
                    <p> 9.
                        贵公司须保留与其客户之间的交易资料（包括但不限于订单、签购单、发货凭证及iPay要求的其他交易资料，如采用IVR语音系统的，贵公司应当保留语音资料）至少五年，以备iPay或银行方查验。</p>
                    <p> 10. 贵公司累计拒付/欺诈定单或总笔数/总金额超过限额，贵公司应在五个工作日内向iPay提交本相关交易的交易凭证等相关证据材料，具体限额由主协议第七条约定。</p>
                    <p> 11.
                        对于网上交易流程中由于缺货、无法运货、重复订单等不能为消费者提供服务而需做退款处理的情况，贵公司应及时退款或通过iPay提供的商户管理系统委托iPay代为完成退款操作，并承担全部责任。</p>
                    <p class="title1"> 四、 专有信息和保密</p>
                    <p> 1. iPay拥有iPay所提供网络服务内容的所有权和知识产权。iPay基于网站的网络服务内容的所有权包括但不限于：</p>
                    <p> a) 文字、软件、声音、图片、录像、图表、标示、广告中的全部内容；</p>
                    <p> b) 电子邮件的全部内容；iPay网站为用户提供的其他数据信息等；</p>
                    <p> c) 基于上述内容所有的版权、商标、标签以及其他财产所有权和权益。</p>
                    <p> 2. 双方在合作期内获得的信息及本合同内容均为保密信息。保密信息包括但不限于：</p>
                    <p> a) 交易手续费和服务年费的金额及支付方式；</p>
                    <p> b) 结算方式、接口技术、安全协议及证书等；</p>
                    <p> c) 其他因签订本合同知悉的对方经营、运行记忆交易等商业信息。</p>
                    <p>
                        3.甲乙双方及其全部员工（包括可以直接或间接接触到通过电子支付方式付款的客户的银行卡资料及信息的所有员工）必须对其知晓的客户的银行卡资料予以保密。不得泄露、披露客户的银行卡资料，更不得利用客户的银行卡资料从事盗卡、伪冒等非法交易。如发生上述情形造成持卡人损失的，由责任方依法承担责任。</p>
                    <p>
                        4.甲乙双方对本协议条款（包括附件和补充协议）、技术信息、经营信息等保密信息负有同样的保密义务。在本协议的磋商、订立过程中、本协议期内以及本协议终止后的任何和所有时间内，任何一方在事先未经对方书面同意的情况下，不得向任何第三方披露、泄漏任何对方的保密信息；否则应当承担法律责任。</p>
                    <p> 5. 在本协议履行期间及履行结束后，一方违反上述约定，另一方有权主张对方停止侵害并得向对方主张违约金及损害赔偿金，同时有权单方终止本协议。</p>
                    <p> 6. 本协议项下的保密责任不因本协议的无效、提前终止、解除或不具操作性而失效。</p>
                    <p class="title1"> 五、 违约责任与责任限制</p>
                    <p> 1. 一方因违反本协议约定造成对方损失的，另一方有权请求损害赔偿，赔偿的范围包括实际损失及主张实际损失的费用。</p>
                    <p>
                        2.因贵公司、消费者或者用户、银行、电信、网络、设备及供电故障、不可抗力或iPay以外的其他原因，导致iPay的支付产品不能正常运营或iPay不能及时履行本协议规定义务的，iPay不承担相关的法律及赔偿责任；贵公司应当保证iPay免于因贵公司原因而可能导致的第三人诉讼或者赔偿请求；</p>
                    <p>
                        3.本协议中涉及iPay对贵公司的消费者、用户或第三方的服务,是iPay履行对贵公司义务的行为,并不构成对贵公司的消费者、用户或第三方的任何承诺,贵公司的消费者、用户或第三方不因此而获得对iPay的直接请求权；iPay以专业的态度及方式履行本协议的义务，对于违反此项承诺的唯一补救措施和责任是重新履行。</p>
                    <p> 4. iPay作为独立的第三方支付平台，在履行本协议过程中所可能涉及任何情况下，不对贵公司的业务损失、利润损失或其它间接损失负责。</p>
                    <p> 5. iPay承担的赔偿责任，所赔偿金额不超过贵公司支付的上一年度的服务费。</p>
                    <p> 6. 本协议中涉及罚金的条款，罚金的标准为5000元人民币/次；涉及冻结账户的条款，冻结的标准为180天。涉及GBPP/BRAM以及其它处罚的，按照卡组织和银行相关规定执行。</p>
                    <p class="title1"> 六、 不可抗力</p>
                    <p>
                        1.本协议所称“不可抗力”是指在本协议签订后发生的、一方无法预见、无法避免并无法克服的客观情况。包括但不限于水灾、火灾、旱灾、台风、地震及其它自然灾害、罢工、骚动、暴乱及战争（不论宣战与否）以及政府部门的作为或不作为。</p>
                    <p> 2.
                        鉴于网络所具有之特殊性，本协议项下的不可抗力还包括不限于黑客恶意攻击，现有正常安全手段无法预防的计算机病毒侵入及发作，大规模新型病毒的爆发、电力故障或限制性供电等外来原因断电等影响网络正常经营的情形。</p>
                    <p> 3. 因受不可抗力影响而不能履行或不能完全履行本协议的，一方可以部分或全部免除履行其责任。</p>
                    <p>
                        4.可抗力发生后，甲乙双方须立即协商继续履行本协议之相关事宜，并签订临时协议；临时协议的效力在该等不可抗力及其影响终止或消除时终止。如不可抗力及其影响在发生一个月后仍未终止或消除的，则甲乙双方可协商终止本协议。</p>
                </div>
                <el-button size="mini" @click="showWord=false;show=true" type="primary"
                           style="display: block;margin: 20px auto"> 返回
                </el-button>
            </div>
        </div>
        <p class="footer">copyright © 2015-2018</p>
    </div>
</template>
<script>
    import {submitForm, getSubmitJson, reset} from '../../assets/js/submitForm'
    import classPost from '../../servies/classPost'

    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (!/(?!^(\d+|[a-zA-Z_]+|[~!@#$%^&*?,.:;\+\-=/'"<>\|\[\]\(\)]+)$)^[\w~!@#$%\^&*?_,.:;\+\-=/'"<>\(\)\|\[\]]{6,20}$/.test(value)) {
                    this.pwdStrength = ''
                    callback(new Error('请按规则输入'));
                } else {
                    let length = value.length;
                    //低
                    if (/[1-9]/.test(value) || (/[a-z1-9]/.test(value) && length < 10)) {
                        this.pwdStrength = 'di'
                    }
                    //    中
                    if (/[a-z1-9]/.test(value) && length < 15 && length >= 10) {
                        this.pwdStrength = 'zhong'
                    }
                    //    高
                    if (/[a-z1-9]/.test(value) && length >= 15) {
                        this.pwdStrength = 'gao'
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value == this.ruleForm.loginPassword) {
                    callback(new Error('支付密码不能与登录密码相同'));
                } else {
                    //~!@#$%^&*()_+":?><,.\|-=
                    if (!/(?!^(\d+|[a-zA-Z_]+|[~!@#$%^&*?,.:;\+\-=/'"<>\|\[\]\(\)]+)$)^[\w~!@#$%\^&*?_,.:;\+\-=/'"<>\(\)\|\[\]]{6,20}$/.test(value)) {
                        this.pwdStrength2 = '';
                        callback(new Error('请按规则输入'));
                    } else {
                        let length = value.length;
                        //低
                        if ( length < 10 ) {
                            this.pwdStrength2 = 'di';
                        }
                        //    中
                        if ( length < 15 && length >= 10) {
                            this.pwdStrength2 = 'zhong';
                        }
                        //    高
                        if ( length >= 15) {
                            this.pwdStrength2 = 'gao';
                        }
                        callback();
                    }
                }
            };
            var loginPass = (rule, value, callback) => {
                if (value !== this.ruleForm.loginPassword) {
                    callback(new Error('两次登录密码输入不一致'));
                } else {
                    callback();
                }
            };
            var payPass = (rule, value, callback) => {
                if (value !== this.ruleForm.payPassword) {
                    callback(new Error('两次支付密码输入不一致'));
                } else {
                    callback();
                }
            };
            var loginName = (rule, value, callback) => {
                if (!/^(?!(\d+)$)[a-zA-Z\d]{5,25}$/.test(value)) {
                    callback(new Error('请按规则输入'));
                } else {
                    callback();
                }
            };
            return {
                username: '',
                ruleForm: {
                    loginName: '',
                    loginPassword: '',
                    loginPasswordConfirm: '',
                    payPassword: '',
                    payPasswordConfirm: '',
                    securityQuestion: '',
                    securityAnswer: '',
                    greeting: '',
                    verifyCode: '',
                    checked: [],
                },
                rules: {
                    loginName: [
                        {required: true, message: '请输入管理员', trigger: 'blur'},
                        {validator: loginName, trigger: 'blur'}
                    ],
                    loginPassword: [
                        {required: true, message: '请输入登录密码', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    loginPasswordConfirm: [
                        {required: true, message: '请再次输入登录密码', trigger: 'blur'},
                        {validator: loginPass, trigger: 'blur'}
                    ],
                    payPassword: [
                        {required: true, message: '请输入支付密码', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                    payPasswordConfirm: [
                        {required: true, message: '请再次输入支付密码', trigger: 'blur'},
                        {validator: payPass, trigger: 'blur'}
                    ],
                    securityQuestion: [
                        {required: true, message: '请填写', trigger: 'blur'}
                    ],
                    securityAnswer: [
                        {required: true, message: '请填写', trigger: 'blur'}
                    ],
                    greeting: [
//                        {required:true,message:'请填写',trigger:'blur'}
                    ],
                    verifyCode: [
                        {required: true, message: '请填写', trigger: 'blur'}
                    ],
                    checked: [
//                        {required:true,message:'请同意iPayLinks服务协议',trigger:'change'}
                        {type: 'array', required: true, message: '请同意iPayLinks服务协议', trigger: 'change'}
                    ]
                },
                pwdStrength: '',
                pwdStrength2: '',
                piccode: '',
                questionArr: [],
                checkCode: '',
                show: true,
                showWord: false
            }
        },
        methods: {
            submitForm,
            success(children) {
                let submitJson = getSubmitJson(children);
                submitJson.checkCode = this.checkCode;
                delete submitJson.checked;
                console.log(submitJson)
                classPost.merchantActive(submitJson)
                    .then((res) => {
                        console.log(res)
                        this.$message({
                            message: '商户帐号激活成功，请登录MPS尝试更多功能！',
                            type: 'success'
                        });
                        let _this = this;
                        setTimeout(function () {
                            _this.$router.push('/login')
                        }, 800)
                    })
                    .catch((err) => {
                        this.getCode();
                        console.log(err)
                    })
            },
            error() {
                console.log('验证失败')
            },
            getCode() {
//            获取图片验证码
                classPost.getVerify()
                    .then((res) => {
                        let blob = new Blob([res], {type: "application/vnd.ms-excel"});
                        let objectUrl = URL.createObjectURL(blob);
                        this.piccode = objectUrl;
                    })
            }
        },
        mounted: function () {
            //获取激活码
            this.checkCode = this.$route.params.id;
//            验证激活
            //查看激活码是否有效
            classPost.activeInfo({checkCode: this.checkCode})
                .then((res) => {
                    console.log(res);
                    this.show = true;
                    this.username = res.data.regAccount;
                    this.ruleForm.loginName = res.data.loginName;
                    //获取图片验证码
                    this.getCode();
                    // 获取安全问题
                    classPost.securityQuestion({})
                        .then((res) => {
                            this.questionArr = res.data;
                        })
                        .catch()
                })
                .catch((err) => {
                    console.log(err)
                    this.show = false;
                })
        }
    }
</script>

<style>
    .newUser {
        background: #F7F7F7;
    }

    .newUser .nav {
        width: 100%;
        height: 80px;
        background: rgba(42, 118, 177, 1);
        padding-top: 28px;
    }

    .newUser .inWidth {
        width: 938px;
        margin: auto;
    }

    .newUser .container {
        width: 938px;
        margin: auto;
        background: #fff;
        padding-top: 43px;
        padding: 27px 34px 110px;
        margin-bottom: 91px;
        margin-top: 43px
    }

    .newUser .formBox {
        width: 100%;
        height: auto;
        border-top: 1px dashed #E5E5E5;
        padding-top: 10px;
    }

    .newUser .footer {
        height: 17px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.46);
        line-height: 17px;
        text-align: center;
        padding-bottom: 42px;
    }

    .newUser .el-input {
        width: 310px;
    }

    /*.newUser .el-input .el-input__inner{height:36px;}*/
    .newUser .clearfix label {
        font-size: 16px;
        color: rgba(255, 109, 51, 1);
    }

    .newUser .clearfix span {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.47);
    }

    .newUser p.title {
        height: 42px;
        font-size: 30px;
        color: rgba(39, 42, 51, 1);
        line-height: 42px;
        text-align: center;
        margin-bottom: 60px
    }

    .newUser .tag div {
        font-size: 12px;
    }

    /*提示气泡*/
    .newUser .tag {
        z-index: 99;
        font-size: 12px;
        /*display:none;*/
        width: 310px;
        padding: 6.5px 19px;
        position: absolute;
        top: 4px;
        left: 52%;
        background: rgba(230, 247, 255, 1);
        border-radius: 2px;
        border: 1px solid #91D5FF;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        line-height: 17px;
        color: rgba(96, 98, 102, 0.65);
        font-size: 12px;
    }

    .newUser .tag i {
        content: '';
        display: block;
        width: 7px;
        height: 7px;
        border-top: 1px solid #91D5FF;
        border-left: 1px solid #91D5FF;
        position: absolute;
        top: 15px;
        left: -5px;
        background: rgba(230, 247, 255, 1);
        transform: rotate(-45deg);
    }

    .newUser .tag .qiangdu p {
        display: inline-block;
        margin-left: 9px;
    }

    .newUser .tag .qiangdu span {
        display: inline-block;
        width: 16px;
        height: 6px;
        background: rgba(178, 178, 178, 1);
        margin-left: 4px;
    }

    .newUser .tag .di {
        color: #E8541E;
    }

    .newUser .tag .zhong {
        color: #FAAD14;
    }

    .newUser .tag .gao {
        color: #52C41A;
    }

    .newUser .tag .qiangdu .di .color {
        background: #E8541E;
    }

    .newUser .tag .qiangdu .zhong .color {
        background: #FAAD14;
    }

    .newUser .tag .qiangdu .gao .color {
        background: #52C41A;
    }

    .newUser .tishi {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.46);
        line-height: 17px;
    }

    .newUser .getImg {
        font-size: 12px;
        line-height: 17px;
        color: rgba(0, 51, 153, 1);
        margin-left: 18px;
        cursor: pointer;
    }

    .newUser .timeout {
        text-align: center;
    }

    .newUser .box p {
        color: rgba(85, 85, 86, 1);
        line-height: 25px;
    }

    .newUser .box .title {
        color: #000;
        line-height: 42px;
    }

    .newUser .box .title1 {
        color: #000;
        line-height: 40px;
        margin-top: 10px;
    }

</style>