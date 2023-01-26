package com.example.demo.controller;

import com.example.demo.domain.CertInfo;

import com.example.demo.repository.CertRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.PasswordMail;
import com.example.demo.service.RegisterMail;
import com.example.demo.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.domain.User;
import com.example.demo.mapping.UserMapping;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.RegisterMail;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping(value = "/user")
@CrossOrigin(
        // localhost:5500 과 127.0.0.1 구분
        origins = "http://localhost:3000", // allowCredentials = "true" 일 경우, origins="*" 는 X
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT,RequestMethod.HEAD,RequestMethod.OPTIONS}
)
public class UserController {

    @Autowired
    UserRepository userRepository; // 유저 검색

    @Autowired
    RegisterMail registerMail; // 회원가입 메일 보내기용

    @Autowired
    PasswordMail passwordMail; // 비밀번호 찾기 메일 보내기용

    @Autowired
    CertRepository certRepository; // 이메일 인증 확인용


    @Autowired
    private SecurityService securityService; // jwt 토큰 사용


    // id 중복 검사
    @GetMapping("/signup/id")
    public boolean checkIdDuplicate(String id) {//@RequestBody HashMap<String, String> param){
        //String id = param.get("id");
        return userRepository.existsById(id);
    }

    // 닉네임 중복 검사
    @GetMapping("/signup/nickname")
    public boolean checkNicknameDuplicate(String nickname) {//@RequestBody HashMap<String, String> param){
        //String nickname = param.get("nickname");
        return userRepository.existsByNickname(nickname);
    }

    @GetMapping("/signup/email")
    public boolean checkEmailDuplicate(String email) {//@RequestBody HashMap<String, String> param){
        //String nickname = param.get("nickname");
        return userRepository.existsByNickname(email);
    }

    // 이메일 인증번호 전송(회원가입용)

    @GetMapping("/registerMail")
    public Boolean sendMail(String email) {
        try {
            String certificate = ""; // 이메일 인증코드 -> 여러 사람이 동시에 인증 -> db에 저장해야함?
            certificate = registerMail.sendSimpleMessage(email);
            System.out.println("사용자에게 발송한 메일 인증코드 ==> " + certificate);
            // 이후, 사용자가 인증 코드를 입력하고 동일한 지 확인하기 위해 인증코드를 DB에 저장
            CertInfo crt = CertInfo.builder().email(email).code(certificate).build();
            certRepository.save(crt);
            return true;
        } catch(Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "인증발송 실패");
        }
    }

    // 이메일 인증(입력한 인증번호와 전송한 인증번호가 동일한지 확인)
    @GetMapping("/certMail")
    public Boolean certMail(String code) {
        try {
            String certificate = certRepository.findByCode(code).getCode(); // DB에 저장되어 있는 인증코드
            // 에러가 발생 안하면 일치하는 코드가 있다는 뜻
            return true;
        } catch(Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "인증번호가 다름");
        }
    }


    // 회원가입
    @PostMapping("/signup")
    public User registerUser(@RequestBody HashMap<String, String> param) {
        String id = param.get("id");
        String password = param.get("password");
        String name = param.get("name");
        String email = param.get("email");
        String nickname = param.get("nickname");
        String permission = param.get("permission");
        String image_path = param.get("image_path");
        String open = param.get("open");
        String si = param.get("si");
        String gun = param.get("gun");
        String dong = param.get("dong");
        String weight = param.get("weight");
        String cycle_weight = param.get("cycle_weight");
        String age = param.get("age");
        String gender = param.get("gender");


        Integer weight_int =  Integer.valueOf(weight);
        Integer cycle_weight_int =  Integer.valueOf(cycle_weight);
        Integer permission_int =  Integer.valueOf(permission);

        Boolean open_bool = true;    //open 상태를 입력된 문자열이 'true' 인지 'false' 인지에 따라 처리
        if(open.equals("true")) {
            open_bool = true;
        } else {
            open_bool = false;
        }
        if (checkIdDuplicate(id)){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "아이디 중복");
        }

        if (checkNicknameDuplicate(nickname)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "닉네임 중복");
        }

        if (checkEmailDuplicate(email)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "이메일 중복");
        }

        if (id.length() > 20 || id.length() < 5){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "아이디 길이 확인");
        }

        if (password.length() > 16 || password.length() < 8){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "비밀번호 길이 확인");
        }


        for (int i = 0; i < id.length(); i++){                  // id 조건 체크 부분

            char chrIdInput = id.charAt(i);

            if (chrIdInput < 0x61 || chrIdInput > 0x7A) {       // 영어 소문자 영역 밖

                if (chrIdInput < 0x30 || chrIdInput > 0x39) {   // 숫자 영역 밖

                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "아이디 조건 확인");
                }

            }
        }


        Boolean alphabet_letter = false;
        Boolean special_letter = false;
        Boolean number_letter = false;

        for (int i = 0; i < password.length(); i++){                  // 비밀번호 조건 체크 부분
            char chrPasswordInput = password.charAt(i);
            if (chrPasswordInput < 0x21 || chrPasswordInput > 0x7E) {       // 영어 대소문자, 숫자, 특수문자 영역 밖
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "비밀번호 조건 확인");
            } else {
                if (chrPasswordInput < 0x30 || (0x3A <= chrPasswordInput && chrPasswordInput <= 0x40)){
                    special_letter = true;
                }
                if (0x5B <= chrPasswordInput && chrPasswordInput <= 0x60) {
                    special_letter = true;
                }
                if (0x7B <= chrPasswordInput) {
                    special_letter = true;
                }
                if (0x30 <= chrPasswordInput && chrPasswordInput <= 0x39) {
                    number_letter = true;
                }
                if (0x41 <= chrPasswordInput && chrPasswordInput <= 0x5A) {
                    alphabet_letter = true;
                }
                if (0x61 <= chrPasswordInput && chrPasswordInput <= 0x7A) {
                    alphabet_letter = true;
                }
            }
        }

        if(!alphabet_letter){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "비밀번호 조건 확인");
        }
        if (!special_letter){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "비밀번호 조건 확인");
        }
        if (!number_letter){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "비밀번호 조건 확인");
        }


        final User user = User.builder()

                .id(id)
                .password(password)
                .name(name)
                .email(email)
                .age(age)
                .gender(gender)
                .open(open_bool)
                .permission(permission_int)
                .imagePath(image_path)
                .nickname(nickname)
                .si(si)
                .gun(gun)
                .dong(dong)
                .weight(weight_int)
                .cycle_weight(cycle_weight_int)


                .build();
        return userRepository.save(user);


    }

//    @PostMapping("/signup")
//    public void registerUser(User user){
//        System.out.println(user);
//        userRepository.save(user);
//    }



    //로그인 - JSON
    @PostMapping("/login")
    public ResponseEntity<HashMap<String, Object>> checkUser(@RequestBody HashMap<String, String> param) { //HashMap<String, Object> 에서 교체
        String id = param.get("id");
        String password = param.get("password");
        HashMap<String,Object> map = new HashMap<String,Object>();

        try {
            User user = userRepository.findByIdAndPassword(id, password);
            map.put("token", securityService.createToken(user.getId() , 60 * 1000 * 60));
//            map.put("name", user.getName());
            map.put("user_id", user.getUserId());
            map.put("image_path", user.getImagePath());
            map.put("nickname", user.getNickname());
//            map.put("age", user.getAge());
//            map.put("si", user.getSi());
//            map.put("gun", user.getGun());
//            map.put("dong", user.getDong());
//            map.put("email", user.getEmail());
//            map.put("weight", user.getWeight());
            map.put("permission", user.getPermission());

            return new ResponseEntity<>(map, HttpStatus.OK);

            //return securityService.createToken(user.getId() , 60 * 1000 * 60); // 200분 후에 만료되는 토큰
        } catch(Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "아이디 혹은 비밀번호 잘못입력" // 로그인 실패시 404 에러를 보여줌
            );
        }

    }


    // 닉네임으로 유저 검색
    @GetMapping("/search")          // 일단 로그인 여부 관계없이 검색가능 => 보여주고자 하는 정보
    public ResponseEntity<HashMap<String, Object>> searchUser(String nickname) {

        try {
            System.out.println(nickname);
            User searched_user = userRepository.findByNickname(nickname);
            HashMap<String,Object> map = new HashMap<String,Object>();
            map.put("user_id", String.valueOf(searched_user.getUserId()));
            map.put("id", searched_user.getId());
            map.put("image_path", searched_user.getImagePath());
            map.put("name", searched_user.getName());
            map.put("age", searched_user.getAge());
            map.put("si", searched_user.getSi());
            map.put("gun", searched_user.getGun());
            map.put("dong", searched_user.getDong());
            if (searched_user.isOpen()){
                map.put("open", "true");
            } else {
                map.put("open", "false");
            }
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch(Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "없는 유저 입니다." // 로그인 실패시 404 에러를 보여줌
            );
        }
    }

    // 관련 닉네임 모두 검색
    @GetMapping("/search/nickname")
    public ResponseEntity<List<HashMap<String, Object>>> findUsersByNickname(String nickname){
        ArrayList<HashMap<String,Object>> list = new ArrayList<HashMap<String,Object>>();
        try {
            List<User> users = userRepository.findByNicknameContaining(nickname);
            for (int i = 0; i < users.size(); i++) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("user_id", String.valueOf(users.get(i).getUserId()));
                map.put("id", users.get(i).getId());
                map.put("nickname", String.valueOf(users.get(i).getNickname()));
                list.add(map);
            }
            System.out.println(users);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "검색된 유저가 없습니다." // 404에러
            );
        }
    }

    // 전체 유저 검색
    @GetMapping("/readAllUser")
    public List readAll() {             // 테스트용, 보안상 나중에 없애든가 해야함

        List<User> users = userRepository.findAll();
        System.out.println(users);

        for (User us : users) {
            System.out.println(us.getId());
            System.out.println(us.getName());
            System.out.println(us.getPassword());
            System.out.println(us.getDong());
        }

        return userRepository.findAll();
    }

//    // 회원 프로필 보기
//    @GetMapping("/readMyProfile")
//    public User readMyProfile(Long userId) {
//        return userRepository.findByUserId(userId);
//    }
//
//    // 회원 프로필 검색 - 닉네임으로
//    @GetMapping("/readProfile")
//    public User readProfile(String nickname) {
//        return userRepository.findByNickname(nickname);
//    }

    // 아이디 찾기 - 성명, 이메일 입력 시 -> 아이디를 리턴
    @PostMapping(value = "/findId")
    public ResponseEntity<HashMap<String, Object>> findId(@RequestBody HashMap<String, String> param) {
        String name = param.get("name");
        String email = param.get("email");
        HashMap<String,Object> map = new HashMap<String,Object>();
        try {
//            System.out.println(name + " " + email);
            String tmp = userRepository.findByNameAndEmail(name, email).getId(); // 이름 이메일 정보를 불러와서
            int len = tmp.length();
            String result = "****";

            map.put("id", tmp.substring(0, len-4) + result);
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "없는 유저 입니다." // 실패시 404 에러를 보여줌
            );
        }
    }

    // 비밀번호 찾기 - 성명, 이메일, 아이디 입력 시 -> 임시 비밀번호를 메일로 전송
    @PostMapping(value = "/findPassword")
    public ResponseEntity<HashMap<String, Object>> findPassword(@RequestBody HashMap<String, String> param ) {
        String name = param.get("name");
        String email = param.get("email");
        String id = param.get("id");
        HashMap<String,Object> map = new HashMap<String,Object>();

        try {
            User user = userRepository.findByNameAndEmailAndId(name, email, id);
            // 이름, 이메일, 아이디가 일치하는 데이터가 존재한다면 이메일로 임시 비밀번호 전송( 셋 모두 동일한 데이터가 없다면 -> catch 문으로)

            String code = passwordMail.sendSimpleMessage(email);
            System.out.println("사용자에게 발송한 임시 비밀번호 ==> " + code);

            // 이름, 이메일, 아이디가 일치하는 데이터의 비밀번호를 임시 비밀번호(code)로 교체
            user.setPassword(code);
            userRepository.save(user);
            map.put("result", "임시 비밀번호가 전송되었습니다.");
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "잘못된 값을 입력하셨습니다." // 실패시 400에러
            );
        }



    }




    // 자기 자신의 회원정보 불러오기
    @PostMapping(value = "/getUserInfo")
    public ResponseEntity<HashMap<String, Object>> getUserInfo(@RequestBody HashMap<String, String> param) {
        String token = param.get("token");
        String id = securityService.getSubject(token);
        HashMap<String,Object> map = new HashMap<String,Object>();
        try {

            User user = userRepository.findById(id);

            map.put("name", user.getName());
            map.put("image_path", user.getImagePath());
            map.put("nickname", user.getNickname());
            map.put("age", user.getAge());
            map.put("si", user.getSi());
            map.put("gun", user.getGun());
            map.put("dong", user.getDong());
            map.put("email", user.getEmail());
            map.put("weight", user.getWeight());
            map.put("cycle_weight", user.getCycle_weight());
            map.put("permission", user.getPermission());
            map.put("open", user.isOpen());

            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "없는 유저 입니다." // 실패시 400에러
            );
        }

    }

    // 회원정보 수정
    @PutMapping(value = "/edit")    // 토큰 필요함
    public ResponseEntity<HashMap<String, Object>> changeUserInfo(@RequestBody HashMap<String, String> param) {

        HashMap<String,Object> map = new HashMap<String,Object>();

        String email = param.get("email");
        String nickname = param.get("nickname");
        String image_path = param.get("image_path");
        String open = param.get("open");
        String si = param.get("si");
        String gun = param.get("gun");
        String dong = param.get("dong");
        String weight = param.get("weight");
        String cycle_weight = param.get("cycle_weight");


        String token = param.get("token");

        String id = securityService.getSubject(token); // 토큰을 통해 변경할 유저를 찾아내자, 토큰 만료거나 없으면 에러가 날 것
        User user = userRepository.findById(id);

        Integer weight_int = Integer.valueOf(weight);
        Integer cycle_weight_int = Integer.valueOf(cycle_weight);

        Boolean open_bool = true;   // open 상태를 입력된 문자열이 'true' 인지 'false' 인지에 따라 처리
        if (open.equals("true")) {
            open_bool = true;
        } else {
            open_bool = false;
        }


        if (checkNicknameDuplicate(nickname)) {     // db에 있는지 확인해야함
            if (nickname.equals(user.getNickname())) {
                System.out.println("중복이지만 기존 닉네임");
            } else {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "닉네임 중복");
            }
        }

        user.setEmail(email);
        user.setNickname(nickname);
        user.setImagePath(image_path);
        user.setOpen(open_bool);
        user.setSi(si);
        user.setGun(gun);
        user.setDong(dong);
        user.setWeight(weight_int);
        user.setCycle_weight(cycle_weight_int);

        map.put("email", user.getEmail());
        map.put("nickname", user.getNickname());
        map.put("image_path", user.getImagePath());
        map.put("open", user.isOpen());
        map.put("si", user.getSi());
        map.put("gun", user.getGun());
        map.put("dong", user.getDong());
        map.put("weight", user.getWeight());
        map.put("cycle_weight", user.getCycle_weight());


        userRepository.save(user);
        return new ResponseEntity<>(map, HttpStatus.OK);    // 변경된 사항 확인용 리턴


        //return "회원정보 변경 완료";
    }




    // 비밀번호 변경
    @PutMapping(value = "/editpwd")         // token, 현재 비밀번호, 새 비밀번호 필요
    public ResponseEntity<HashMap<String, Object>> changePassword(@RequestBody HashMap<String, String> param) { // token : ~~토큰내용~~ 형식으로 보내면됨

        HashMap<String,Object> map = new HashMap<String,Object>();
        String token = param.get("token");
        String id = securityService.getSubject(token);
        User user = userRepository.findById(id);
        //Long user_id = Long.valueOf(String.valueOf(param.get("user_id")));
        String nowPassword = (String) param.get("nowPassword");
        String newPassword = (String) param.get("newPassword");

//        System.out.println(user.getId());
//        System.out.println(user.getPassword());
//        System.out.println(nowPassword);

        if (newPassword.length() > 16 || newPassword.length() < 8){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "새 비밀번호 길이 확인");
        }
        Boolean alphabet_letter = false;
        Boolean special_letter = false;
        Boolean number_letter = false;

        for (int i = 0; i < newPassword.length(); i++){                  // 비밀번호 조건 체크 부분
            char chrPasswordInput = newPassword.charAt(i);
            if (chrPasswordInput < 0x21 || chrPasswordInput > 0x7E) {       // 영어 대소문자, 숫자, 특수문자 영역 밖
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "새 비밀번호 조건 확인");
            } else {
                if (chrPasswordInput < 0x30 || (0x3A <= chrPasswordInput && chrPasswordInput <= 0x40)){
                    special_letter = true;
                }
                if (0x5B <= chrPasswordInput && chrPasswordInput <= 0x60) {
                    special_letter = true;
                }
                if (0x7B <= chrPasswordInput) {
                    special_letter = true;
                }
                if (0x30 <= chrPasswordInput && chrPasswordInput <= 0x39) {
                    number_letter = true;
                }
                if (0x41 <= chrPasswordInput && chrPasswordInput <= 0x5A) {
                    alphabet_letter = true;
                }
                if (0x61 <= chrPasswordInput && chrPasswordInput <= 0x7A) {
                    alphabet_letter = true;
                }
            }
        }

        if(!alphabet_letter){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "새 비밀번호 조건 확인");
        }
        if (!special_letter){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "새 비밀번호 조건 확인");
        }
        if (!number_letter){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "새 비밀번호 조건 확인");
        }



        // user_id의 정보를 찾아서 현재 비밀번호가 nowPassword와 동일하다면 newPassword로 변경
        //User user = userRepository.findById(user_id).get();

        if ( user.getPassword().equals(nowPassword)) {
            if (user.getPassword().equals(newPassword)) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "현재 비밀번호와 같은 건 사용이 안됩니다."
                );
            }
            user.setPassword(newPassword);
            userRepository.save(user);
            map.put("result", "설정이 변경되었습니다.");
            return new ResponseEntity<>(map, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "비밀번호가 다릅니다." // 비밀번호 일치 실패시 404 에러를 보여줌
            );
        }


    }

    // 회원 탈퇴
    @DeleteMapping(value = "/deleteUser") //  토큰과 비밀번호를 보내서 해당하는 아이디를 삭제하는 걸로 변경
    public ResponseEntity<HashMap<String, Object>> deleteUser(@RequestBody HashMap<String, String> param){       //@PathVariable("id") Long user_id) {
        //User user = userRepository.findById(user_id).orElseThrow(IllegalArgumentException::new);
        HashMap<String,Object> map = new HashMap<String,Object>();

        String token = param.get("token");
        String password = param.get("password");
        String id = securityService.getSubject(token);
        try {
            User user = userRepository.findById(id);
            if (user.getPassword().equals(password)) {
                userRepository.delete(user);
                map.put("result", "탈퇴 성공");
                return new ResponseEntity<>(map, HttpStatus.OK);
            } else {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "비밀번호 오류"
                );
            }
        } catch(Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "탈퇴 실패."
            ); // 비밀번호 일치 실패시 404 에러를 보여줌
            //return "에러 발생";
        }
    }

}